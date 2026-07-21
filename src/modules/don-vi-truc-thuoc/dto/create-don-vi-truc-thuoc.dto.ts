import { IsEnum, IsOptional, IsString } from 'class-validator';
import { LoaiHinhDoanhNghiep } from '../../doanh-nghiep/schemas/doanh-nghiep.schema';

export class CreateDonViTrucThuocDto {
  @IsString()
  tenDonVi: string;

  @IsEnum(LoaiHinhDoanhNghiep)
  loaiHinh: LoaiHinhDoanhNghiep;

  @IsOptional()
  @IsString()
  maSoThueHoacMaDangKy?: string;

  @IsOptional()
  @IsString()
  nguoiDaiDien?: string;

  @IsOptional()
  @IsString()
  soDienThoai?: string;

  @IsOptional()
  @IsString()
  diaChi?: string;
}
