import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ThanhVienService } from '../thanh-vien/thanh-vien.service';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly thanhVienService: ThanhVienService,
    private readonly jwtService: JwtService,
  ) {}

  async login(soDienThoai: string, matKhau: string) {
    const thanhVien = await this.thanhVienService.xacThuc(soDienThoai, matKhau);

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
}
