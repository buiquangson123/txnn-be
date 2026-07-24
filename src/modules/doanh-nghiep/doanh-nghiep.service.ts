import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { CodeGeneratorService } from '../../common/code-generator/code-generator.service';
import { CounterService } from '../../common/counter/counter.service';
import {
  GoiDichVu,
  GoiDichVuDocument,
} from '../goi-dich-vu/schemas/goi-dich-vu.schema';
import { ThanhVienService } from '../thanh-vien/thanh-vien.service';
import { CreateDoanhNghiepDto } from './dto/create-doanh-nghiep.dto';
import { UpdateDoanhNghiepDto } from './dto/update-doanh-nghiep.dto';
import { QueryDoanhNghiepDto } from './dto/query-doanh-nghiep.dto';
import { GanGoiDichVuDto } from './dto/gan-goi-dich-vu.dto';
import { DangKyDoanhNghiepDto } from './dto/dang-ky-doanh-nghiep.dto';
import {
  DoanhNghiep,
  DoanhNghiepDocument,
  LoaiHinhDoanhNghiep,
  TrangThaiDoanhNghiep,
} from './schemas/doanh-nghiep.schema';

/** Freemium tự kích hoạt: chưa có cổng thanh toán thật nên dùng thời hạn mặc định cố định */
const THOI_HAN_TU_KICH_HOAT_NGAY = 30;

@Injectable()
export class DoanhNghiepService {
  constructor(
    @InjectModel(DoanhNghiep.name)
    private readonly doanhNghiepModel: Model<DoanhNghiepDocument>,
    @InjectModel(GoiDichVu.name)
    private readonly goiDichVuModel: Model<GoiDichVuDocument>,
    private readonly codeGeneratorService: CodeGeneratorService,
    private readonly counterService: CounterService,
    private readonly configService: ConfigService,
    private readonly thanhVienService: ThanhVienService,
  ) {}

  async create(dto: CreateDoanhNghiepDto) {
    let maDoanhNghiep = dto.maDoanhNghiep;
    if (!maDoanhNghiep) {
      const prefix = this.configService.get<string>('ICHECK_PREFIX', '9999999');
      const sequence =
        await this.counterService.getNextSequence('ma_doanh_nghiep');
      maDoanhNghiep = this.codeGeneratorService.generateMaDoanhNghiep(
        prefix,
        sequence,
      );
    } else {
      const daTonTai = await this.doanhNghiepModel
        .findOne({ maDoanhNghiep })
        .exec();
      if (daTonTai) {
        throw new BadRequestException(
          'Mã doanh nghiệp đã tồn tại, vui lòng nhập lại',
        );
      }
    }

    const doc: Partial<DoanhNghiep> = {
      tenDoanhNghiep: dto.tenDoanhNghiep,
      maDoanhNghiep,
      maSoThue: dto.maSoThue,
      diaChi: dto.diaChi,
      soDienThoai: dto.soDienThoai,
      email: dto.email,
      loaiHinh: dto.loaiHinh,
      logo: dto.logo,
      trangThai: TrangThaiDoanhNghiep.CHO_KICH_HOAT,
      lichSuGoiDichVu: [],
    };

    const doanhNghiep = await this.doanhNghiepModel.create(doc);

    if (dto.sdtThanhVienDauTien) {
      const { matKhauTamThoi } = await this.thanhVienService.taoAdminDauTien(
        (doanhNghiep._id as Types.ObjectId).toString(),
        dto.sdtThanhVienDauTien,
      );
      return { doanhNghiep, matKhauTamThoi };
    }

    return { doanhNghiep };
  }

  /**
   * Tự đăng ký (Freemium, new-requirement.md giai đoạn 1) - không cần System Admin thao tác.
   * Tạo doanh nghiệp mới ở trạng thái "Chưa kích hoạt" + tài khoản Admin DN đầu tiên với
   * mật khẩu do chính người dùng chọn (không phải mật khẩu tạm thời).
   */
  async dangKyTuDo(dto: DangKyDoanhNghiepDto) {
    const prefix = this.configService.get<string>('ICHECK_PREFIX', '9999999');
    const sequence =
      await this.counterService.getNextSequence('ma_doanh_nghiep');
    const maDoanhNghiep = this.codeGeneratorService.generateMaDoanhNghiep(
      prefix,
      sequence,
    );

    const doanhNghiep = await this.doanhNghiepModel.create({
      tenDoanhNghiep: dto.tenDoanhNghiep,
      maDoanhNghiep,
      loaiHinh: LoaiHinhDoanhNghiep.DOANH_NGHIEP,
      soDienThoai: dto.soDienThoai,
      trangThai: TrangThaiDoanhNghiep.CHO_KICH_HOAT,
      lichSuGoiDichVu: [],
    });

    const thanhVien = await this.thanhVienService.taoAdminTuDangKy(
      (doanhNghiep._id as Types.ObjectId).toString(),
      dto.soDienThoai,
      dto.matKhau,
      dto.hoTen,
    );

    return { doanhNghiep, thanhVien };
  }

  /**
   * Tự kích hoạt (Freemium) - Admin DN tự chọn 1 gói dịch vụ để mở khóa, không qua System Admin.
   * Chưa có cổng thanh toán thật nên kích hoạt ngay, thời hạn mặc định 30 ngày kể từ lúc này.
   */
  async tuKichHoat(doanhNghiepId: string, goiDichVuId: string) {
    const doanhNghiep = await this.doanhNghiepModel
      .findById(doanhNghiepId)
      .exec();
    if (!doanhNghiep) {
      throw new NotFoundException('Không tìm thấy doanh nghiệp');
    }
    if (doanhNghiep.trangThai !== TrangThaiDoanhNghiep.CHO_KICH_HOAT) {
      throw new BadRequestException(
        'Doanh nghiệp không ở trạng thái chờ kích hoạt',
      );
    }
    const goiDichVu = await this.goiDichVuModel.findById(goiDichVuId).exec();
    if (!goiDichVu) {
      throw new BadRequestException('Gói dịch vụ không tồn tại');
    }

    const ngayBatDau = new Date();
    const ngayKetThuc = new Date(
      ngayBatDau.getTime() + THOI_HAN_TU_KICH_HOAT_NGAY * 24 * 60 * 60 * 1000,
    );
    const goiDichVuObjectId = new Types.ObjectId(goiDichVuId);
    doanhNghiep.goiDichVu = goiDichVuObjectId;
    doanhNghiep.ngayBatDauGoi = ngayBatDau;
    doanhNghiep.ngayKetThucGoi = ngayKetThuc;
    doanhNghiep.trangThai = TrangThaiDoanhNghiep.HOAT_DONG;
    doanhNghiep.lichSuGoiDichVu.push({
      goiDichVu: goiDichVuObjectId,
      ngayBatDau,
      ngayKetThuc,
    });
    await doanhNghiep.save();
    return doanhNghiep;
  }

  findAll(query: QueryDoanhNghiepDto) {
    const filter: Record<string, unknown> = {};
    if (query.loaiHinh) filter.loaiHinh = query.loaiHinh;
    if (query.trangThai) filter.trangThai = query.trangThai;
    if (query.goiDichVuId) filter.goiDichVu = query.goiDichVuId;
    if (query.keyword) {
      filter.$or = [
        { tenDoanhNghiep: { $regex: query.keyword, $options: 'i' } },
        { maDoanhNghiep: { $regex: query.keyword, $options: 'i' } },
        { soDienThoai: { $regex: query.keyword, $options: 'i' } },
      ];
    }
    return this.doanhNghiepModel
      .find(filter)
      .populate('goiDichVu')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string) {
    const doanhNghiep = await this.doanhNghiepModel
      .findById(id)
      .populate('goiDichVu')
      .exec();
    if (!doanhNghiep) {
      throw new NotFoundException('Không tìm thấy doanh nghiệp');
    }
    return doanhNghiep;
  }

  async update(id: string, dto: UpdateDoanhNghiepDto) {
    if (dto.maDoanhNghiep) {
      const trung = await this.doanhNghiepModel
        .findOne({ maDoanhNghiep: dto.maDoanhNghiep, _id: { $ne: id } })
        .exec();
      if (trung) {
        throw new BadRequestException(
          'Mã doanh nghiệp đã tồn tại, vui lòng nhập lại',
        );
      }
    }
    const doanhNghiep = await this.doanhNghiepModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!doanhNghiep) {
      throw new NotFoundException('Không tìm thấy doanh nghiệp');
    }
    return doanhNghiep;
  }

  async khoa(id: string) {
    return this.doiTrangThai(id, TrangThaiDoanhNghiep.KHOA);
  }

  async moKhoa(id: string) {
    return this.doiTrangThai(id, TrangThaiDoanhNghiep.HOAT_DONG);
  }

  private async doiTrangThai(id: string, trangThai: TrangThaiDoanhNghiep) {
    const doanhNghiep = await this.doanhNghiepModel
      .findByIdAndUpdate(id, { trangThai }, { new: true })
      .exec();
    if (!doanhNghiep) {
      throw new NotFoundException('Không tìm thấy doanh nghiệp');
    }
    return doanhNghiep;
  }

  async ganGoiDichVu(id: string, dto: GanGoiDichVuDto) {
    const doanhNghiep = await this.doanhNghiepModel.findById(id).exec();
    if (!doanhNghiep) {
      throw new NotFoundException('Không tìm thấy doanh nghiệp');
    }
    const goiDichVu = await this.goiDichVuModel
      .findById(dto.goiDichVuId)
      .exec();
    if (!goiDichVu) {
      throw new BadRequestException('Gói dịch vụ không tồn tại');
    }
    const ngayBatDau = new Date(dto.ngayBatDau);
    const ngayKetThuc = new Date(dto.ngayKetThuc);
    if (ngayKetThuc <= ngayBatDau) {
      throw new BadRequestException('Ngày kết thúc phải sau ngày bắt đầu');
    }

    const goiDichVuObjectId = new Types.ObjectId(dto.goiDichVuId);
    doanhNghiep.goiDichVu = goiDichVuObjectId;
    doanhNghiep.ngayBatDauGoi = ngayBatDau;
    doanhNghiep.ngayKetThucGoi = ngayKetThuc;
    doanhNghiep.lichSuGoiDichVu.push({
      goiDichVu: goiDichVuObjectId,
      ngayBatDau,
      ngayKetThuc,
    });
    await doanhNghiep.save();
    return doanhNghiep;
  }
}
