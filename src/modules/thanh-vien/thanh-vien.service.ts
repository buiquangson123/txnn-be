import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { Role } from '../../common/enums/role.enum';
import {
  DoanhNghiep,
  DoanhNghiepDocument,
} from '../doanh-nghiep/schemas/doanh-nghiep.schema';
import { CreateThanhVienDto } from './dto/create-thanh-vien.dto';
import { UpdateThanhVienDto } from './dto/update-thanh-vien.dto';
import { QueryThanhVienDto } from './dto/query-thanh-vien.dto';
import {
  ThanhVien,
  ThanhVienDocument,
  TrangThaiThanhVien,
} from './schemas/thanh-vien.schema';

function sinhMatKhauNgauNhien(): string {
  return Math.random().toString(36).slice(-8);
}

@Injectable()
export class ThanhVienService {
  constructor(
    @InjectModel(ThanhVien.name)
    private readonly thanhVienModel: Model<ThanhVienDocument>,
    @InjectModel(DoanhNghiep.name)
    private readonly doanhNghiepModel: Model<DoanhNghiepDocument>,
  ) {}

  private async kiemTraTrungSdt(soDienThoai: string, excludeId?: string) {
    const filter: Record<string, unknown> = { soDienThoai };
    if (excludeId) filter._id = { $ne: excludeId };
    const trung = await this.thanhVienModel.findOne(filter).exec();
    if (trung) {
      throw new BadRequestException(
        'Số điện thoại đã được sử dụng bởi thành viên khác',
      );
    }
  }

  /** Dùng bởi script seed - tạo tài khoản System Admin đầu tiên (không thuộc DN nào). */
  async taoSystemAdmin(soDienThoai: string, matKhau: string, hoTen: string) {
    await this.kiemTraTrungSdt(soDienThoai);
    const matKhauHash = await bcrypt.hash(matKhau, 10);
    return this.thanhVienModel.create({
      hoTen,
      soDienThoai,
      matKhauHash,
      vaiTro: Role.SYSTEM_ADMIN,
      trangThai: TrangThaiThanhVien.HOAT_DONG,
    });
  }

  /** Dùng khi System Admin khởi tạo DN mới - tạo tài khoản Admin DN đầu tiên, trả về mật khẩu tạm thời. */
  async taoAdminDauTien(doanhNghiepId: string, soDienThoai: string) {
    await this.kiemTraTrungSdt(soDienThoai);
    const matKhauTamThoi = sinhMatKhauNgauNhien();
    const matKhauHash = await bcrypt.hash(matKhauTamThoi, 10);
    const thanhVien = await this.thanhVienModel.create({
      hoTen: 'Quản trị viên',
      soDienThoai,
      matKhauHash,
      vaiTro: Role.ADMIN_DOANH_NGHIEP,
      doanhNghiep: new Types.ObjectId(doanhNghiepId),
      trangThai: TrangThaiThanhVien.HOAT_DONG,
    });
    return { thanhVien, matKhauTamThoi };
  }

  /**
   * Dùng khi tự đăng ký (Freemium) - tạo tài khoản Admin DN đầu tiên với mật khẩu do
   * chính người dùng chọn (khác taoAdminDauTien(): mật khẩu tạm thời do hệ thống sinh,
   * dùng khi System Admin khởi tạo DN thay cho khách hàng).
   */
  async taoAdminTuDangKy(
    doanhNghiepId: string,
    soDienThoai: string,
    matKhau: string,
    hoTen: string,
  ) {
    await this.kiemTraTrungSdt(soDienThoai);
    const matKhauHash = await bcrypt.hash(matKhau, 10);
    return this.thanhVienModel.create({
      hoTen,
      soDienThoai,
      matKhauHash,
      vaiTro: Role.ADMIN_DOANH_NGHIEP,
      doanhNghiep: new Types.ObjectId(doanhNghiepId),
      trangThai: TrangThaiThanhVien.HOAT_DONG,
    });
  }

  /** true nếu vai trò này thấy toàn bộ thành viên trong DN, false nếu chỉ thấy người do mình tạo */
  private xemDuocToanBo(vaiTro: Role): boolean {
    return vaiTro === Role.SYSTEM_ADMIN || vaiTro === Role.ADMIN_DOANH_NGHIEP;
  }

  async create(
    doanhNghiepId: string,
    dto: CreateThanhVienDto,
    nguoiTaoId: string,
  ) {
    const doanhNghiep = await this.doanhNghiepModel
      .findById(doanhNghiepId)
      .exec();
    if (!doanhNghiep) {
      throw new BadRequestException('Doanh nghiệp không tồn tại');
    }
    await this.kiemTraTrungSdt(dto.soDienThoai);

    const matKhauTamThoi = dto.matKhau ?? sinhMatKhauNgauNhien();
    const matKhauHash = await bcrypt.hash(matKhauTamThoi, 10);

    const thanhVien = await this.thanhVienModel.create({
      hoTen: dto.hoTen,
      soDienThoai: dto.soDienThoai,
      matKhauHash,
      email: dto.email,
      vaiTro: dto.vaiTro,
      chucDanh: dto.chucDanh,
      donViPhongBan: dto.donViPhongBan,
      doanhNghiep: doanhNghiep._id,
      nguoiTao: new Types.ObjectId(nguoiTaoId),
      trangThai: TrangThaiThanhVien.HOAT_DONG,
    });

    return {
      thanhVien,
      // chỉ trả về khi hệ thống tự sinh, để Admin gửi lại cho thành viên
      matKhauTamThoi: dto.matKhau ? undefined : matKhauTamThoi,
    };
  }

  findAll(
    doanhNghiepId: string,
    query: QueryThanhVienDto,
    nguoiXem: { id: string; vaiTro: Role },
  ) {
    const filter: Record<string, unknown> = { doanhNghiep: doanhNghiepId };
    if (!this.xemDuocToanBo(nguoiXem.vaiTro)) filter.nguoiTao = nguoiXem.id;
    if (query.vaiTro) filter.vaiTro = query.vaiTro;
    if (query.trangThai) filter.trangThai = query.trangThai;
    if (query.keyword) {
      filter.$or = [
        { hoTen: { $regex: query.keyword, $options: 'i' } },
        { soDienThoai: { $regex: query.keyword, $options: 'i' } },
      ];
    }
    return this.thanhVienModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  async findOne(
    doanhNghiepId: string,
    id: string,
    nguoiXem: { id: string; vaiTro: Role },
  ) {
    const filter: Record<string, unknown> = {
      _id: id,
      doanhNghiep: doanhNghiepId,
    };
    if (!this.xemDuocToanBo(nguoiXem.vaiTro)) filter.nguoiTao = nguoiXem.id;
    const thanhVien = await this.thanhVienModel.findOne(filter).exec();
    if (!thanhVien) {
      throw new NotFoundException('Không tìm thấy thành viên');
    }
    return thanhVien;
  }

  async update(
    doanhNghiepId: string,
    id: string,
    dto: UpdateThanhVienDto,
    nguoiXem: { id: string; vaiTro: Role },
  ) {
    const thanhVienHienTai = await this.findOne(doanhNghiepId, id, nguoiXem);

    if (dto.soDienThoai) {
      await this.kiemTraTrungSdt(dto.soDienThoai, id);
    }
    if (dto.vaiTro && dto.vaiTro !== thanhVienHienTai.vaiTro) {
      if (dto.vaiTro !== Role.QUAN_LY && dto.vaiTro !== Role.NHAN_VIEN) {
        throw new BadRequestException('Vai trò mới không hợp lệ');
      }
      if (thanhVienHienTai.vaiTro === Role.ADMIN_DOANH_NGHIEP) {
        throw new BadRequestException(
          'Không thể đổi vai trò của Admin doanh nghiệp',
        );
      }
    }

    const thanhVien = await this.thanhVienModel
      .findOneAndUpdate({ _id: id, doanhNghiep: doanhNghiepId }, dto, {
        new: true,
      })
      .exec();
    if (!thanhVien) {
      throw new NotFoundException('Không tìm thấy thành viên');
    }
    return thanhVien;
  }

  private async dangLaAdminDnDuyNhat(thanhVien: ThanhVienDocument) {
    if (thanhVien.vaiTro !== Role.ADMIN_DOANH_NGHIEP) return false;
    const soAdminConLai = await this.thanhVienModel
      .countDocuments({
        doanhNghiep: thanhVien.doanhNghiep,
        vaiTro: Role.ADMIN_DOANH_NGHIEP,
        trangThai: TrangThaiThanhVien.HOAT_DONG,
        _id: { $ne: thanhVien._id },
      })
      .exec();
    return soAdminConLai === 0;
  }

  async khoa(doanhNghiepId: string, id: string) {
    const thanhVien = await this.thanhVienModel
      .findOne({ _id: id, doanhNghiep: doanhNghiepId })
      .exec();
    if (!thanhVien) {
      throw new NotFoundException('Không tìm thấy thành viên');
    }
    if (await this.dangLaAdminDnDuyNhat(thanhVien)) {
      throw new BadRequestException(
        'Không thể khóa Admin doanh nghiệp cuối cùng của doanh nghiệp',
      );
    }
    thanhVien.trangThai = TrangThaiThanhVien.KHOA;
    await thanhVien.save();
    return thanhVien;
  }

  async moKhoa(doanhNghiepId: string, id: string) {
    const thanhVien = await this.thanhVienModel
      .findOneAndUpdate(
        { _id: id, doanhNghiep: doanhNghiepId },
        { trangThai: TrangThaiThanhVien.HOAT_DONG },
        { new: true },
      )
      .exec();
    if (!thanhVien) {
      throw new NotFoundException('Không tìm thấy thành viên');
    }
    return thanhVien;
  }

  /** Dùng bởi Auth module để xác thực đăng nhập theo SĐT + mật khẩu. */
  async xacThuc(
    soDienThoai: string,
    matKhau: string,
  ): Promise<ThanhVienDocument> {
    const thanhVien = await this.thanhVienModel
      .findOne({ soDienThoai })
      .select('+matKhauHash')
      .exec();
    if (!thanhVien) {
      throw new UnauthorizedException('Số điện thoại hoặc mật khẩu không đúng');
    }
    if (thanhVien.trangThai === TrangThaiThanhVien.KHOA) {
      throw new UnauthorizedException('Tài khoản đã bị khóa');
    }
    const dung = await bcrypt.compare(matKhau, thanhVien.matKhauHash);
    if (!dung) {
      throw new UnauthorizedException('Số điện thoại hoặc mật khẩu không đúng');
    }
    return thanhVien;
  }

  async doiMatKhau(id: string, matKhauHienTai: string, matKhauMoi: string) {
    const thanhVien = await this.thanhVienModel
      .findById(id)
      .select('+matKhauHash')
      .exec();
    if (!thanhVien) {
      throw new NotFoundException('Không tìm thấy thành viên');
    }
    const dung = await bcrypt.compare(matKhauHienTai, thanhVien.matKhauHash);
    if (!dung) {
      throw new BadRequestException('Mật khẩu hiện tại không đúng');
    }
    thanhVien.matKhauHash = await bcrypt.hash(matKhauMoi, 10);
    await thanhVien.save();
    return { updated: true };
  }
}
