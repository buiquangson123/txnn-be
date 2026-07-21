import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { CodeGeneratorService } from '../../common/code-generator/code-generator.service';
import { CounterService } from '../../common/counter/counter.service';
import { GoiDichVu, GoiDichVuDocument } from '../goi-dich-vu/schemas/goi-dich-vu.schema';
import { ThanhVienService } from '../thanh-vien/thanh-vien.service';
import { CreateDoanhNghiepDto } from './dto/create-doanh-nghiep.dto';
import { UpdateDoanhNghiepDto } from './dto/update-doanh-nghiep.dto';
import { QueryDoanhNghiepDto } from './dto/query-doanh-nghiep.dto';
import {
  DoanhNghiep,
  DoanhNghiepDocument,
  TrangThaiDoanhNghiep,
} from './schemas/doanh-nghiep.schema';

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

  private async tinhKhoangThoiGianGoi(goiDichVuId: string) {
    const goiDichVu = await this.goiDichVuModel.findById(goiDichVuId).exec();
    if (!goiDichVu) {
      throw new BadRequestException('Gói dịch vụ không tồn tại');
    }
    const ngayBatDau = new Date();
    const ngayKetThuc = goiDichVu.thoiHanNgay
      ? new Date(ngayBatDau.getTime() + goiDichVu.thoiHanNgay * 24 * 60 * 60 * 1000)
      : undefined;
    return { ngayBatDau, ngayKetThuc };
  }

  async create(dto: CreateDoanhNghiepDto) {
    let maDoanhNghiep = dto.maDoanhNghiep;
    if (!maDoanhNghiep) {
      const prefix = this.configService.get<string>('ICHECK_PREFIX', '9999999');
      const sequence = await this.counterService.getNextSequence('ma_doanh_nghiep');
      maDoanhNghiep = this.codeGeneratorService.generateMaDoanhNghiep(prefix, sequence);
    } else {
      const daTonTai = await this.doanhNghiepModel.findOne({ maDoanhNghiep }).exec();
      if (daTonTai) {
        throw new BadRequestException('Mã doanh nghiệp đã tồn tại, vui lòng nhập lại');
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

    if (dto.goiDichVuId) {
      const { ngayBatDau, ngayKetThuc } = await this.tinhKhoangThoiGianGoi(
        dto.goiDichVuId,
      );
      const goiDichVuObjectId = new Types.ObjectId(dto.goiDichVuId);
      doc.goiDichVu = goiDichVuObjectId;
      doc.ngayBatDauGoi = ngayBatDau;
      doc.ngayKetThucGoi = ngayKetThuc;
      doc.lichSuGoiDichVu = [
        { goiDichVu: goiDichVuObjectId, ngayBatDau, ngayKetThuc },
      ];
    }

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
        throw new BadRequestException('Mã doanh nghiệp đã tồn tại, vui lòng nhập lại');
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

  async ganGoiDichVu(id: string, goiDichVuId: string) {
    const doanhNghiep = await this.doanhNghiepModel.findById(id).exec();
    if (!doanhNghiep) {
      throw new NotFoundException('Không tìm thấy doanh nghiệp');
    }
    const { ngayBatDau, ngayKetThuc } = await this.tinhKhoangThoiGianGoi(goiDichVuId);
    const goiDichVuObjectId = new Types.ObjectId(goiDichVuId);
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
