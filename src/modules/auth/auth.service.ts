import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ThanhVienService } from '../thanh-vien/thanh-vien.service';
import { DoanhNghiepService } from '../doanh-nghiep/doanh-nghiep.service';
import { DangKyDoanhNghiepDto } from '../doanh-nghiep/dto/dang-ky-doanh-nghiep.dto';
import { JwtPayload } from './jwt-payload.interface';
import type { ThanhVienDocument } from '../thanh-vien/schemas/thanh-vien.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly thanhVienService: ThanhVienService,
    private readonly doanhNghiepService: DoanhNghiepService,
    private readonly jwtService: JwtService,
  ) {}

  private async taoPhienDangNhap(thanhVien: ThanhVienDocument) {
    const payload: JwtPayload = {
      sub: (thanhVien._id as { toString(): string }).toString(),
      soDienThoai: thanhVien.soDienThoai,
      vaiTro: thanhVien.vaiTro,
      doanhNghiepId: thanhVien.doanhNghiep?.toString(),
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      thanhVien: {
        id: payload.sub,
        hoTen: thanhVien.hoTen,
        soDienThoai: thanhVien.soDienThoai,
        vaiTro: thanhVien.vaiTro,
        doanhNghiepId: payload.doanhNghiepId,
      },
    };
  }

  async login(soDienThoai: string, matKhau: string) {
    const thanhVien = await this.thanhVienService.xacThuc(soDienThoai, matKhau);
    return this.taoPhienDangNhap(thanhVien);
  }

  /** Freemium - tự đăng ký bằng SĐT, tạo DN "Chưa kích hoạt" + đăng nhập luôn sau khi tạo */
  async dangKy(dto: DangKyDoanhNghiepDto) {
    const { thanhVien } = await this.doanhNghiepService.dangKyTuDo(dto);
    return this.taoPhienDangNhap(thanhVien);
  }
}
