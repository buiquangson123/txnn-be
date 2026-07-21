import { IsEnum, IsOptional, IsString } from 'class-validator';
import { LoaiHinhDoanhNghiep } from '../../doanh-nghiep/schemas/doanh-nghiep.schema';
import { TrangThaiLienKet } from '../schemas/don-vi-truc-thuoc.schema';

export class QueryDonViTrucThuocDto {
  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsEnum(LoaiHinhDoanhNghiep)
  loaiHinh?: LoaiHinhDoanhNghiep;

  @IsOptional()
  @IsEnum(TrangThaiLienKet)
  trangThai?: TrangThaiLienKet;
}
