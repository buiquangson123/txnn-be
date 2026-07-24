import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { TrangThaiGoiDichVu } from '../schemas/goi-dich-vu.schema';

export class CreateGoiDichVuDto {
  @IsString()
  tenGoi: string;

  @IsNumber()
  @Min(0)
  soLuongMaSanPhamToiDa: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  soLuongThanhVienToiDa?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  dungLuongLuuTruMB?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  giaGoi?: number;

  @IsOptional()
  @IsEnum(TrangThaiGoiDichVu)
  trangThai?: TrangThaiGoiDichVu;

  @IsOptional()
  @IsString()
  ghiChu?: string;
}
