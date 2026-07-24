import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { LoaiHinhDoanhNghiep } from '../schemas/doanh-nghiep.schema';

export class CreateDoanhNghiepDto {
  @IsString()
  tenDoanhNghiep: string;

  /** Để trống nếu chưa có mã GS1 - hệ thống sẽ tự sinh */
  @IsOptional()
  @IsString()
  maDoanhNghiep?: string;

  @IsOptional()
  @IsString()
  maSoThue?: string;

  @IsOptional()
  @IsString()
  diaChi?: string;

  @IsOptional()
  @IsString()
  soDienThoai?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsEnum(LoaiHinhDoanhNghiep)
  loaiHinh: LoaiHinhDoanhNghiep;

  @IsOptional()
  @IsString()
  logo?: string;

  /** SĐT thành viên đầu tiên - dùng để khởi tạo tài khoản Admin DN */
  @IsOptional()
  @IsString()
  sdtThanhVienDauTien?: string;
}
