import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
} from 'class-validator';
import { LoaiHinhDoanhNghiep } from '../../doanh-nghiep/schemas/doanh-nghiep.schema';
import { VaiTroDonViLienKet } from '../schemas/don-vi-truc-thuoc.schema';

export class CreateDonViTrucThuocDto {
  @IsString()
  tenDonVi: string;

  @IsEnum(LoaiHinhDoanhNghiep)
  loaiHinh: LoaiHinhDoanhNghiep;

  @IsOptional()
  @IsArray()
  @IsEnum(VaiTroDonViLienKet, { each: true })
  vaiTro?: VaiTroDonViLienKet[];

  @IsOptional()
  @IsString()
  maSoThue?: string;

  @IsOptional()
  @IsString()
  nguoiDaiDien?: string;

  @IsOptional()
  @IsString()
  soDienThoai?: string;

  @IsOptional()
  @IsString()
  diaChi?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(5)
  @IsString({ each: true })
  hinhAnh?: string[];

  /** Để trống nếu DN chưa có mã GLN - hệ thống sẽ tự sinh */
  @IsOptional()
  @IsString()
  maGLN?: string;

  @IsMongoId()
  loaiDiaDiemId: string;
}
