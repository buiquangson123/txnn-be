import { IsEnum, IsMongoId, IsOptional, IsString } from 'class-validator';
import {
  LoaiHinhDoanhNghiep,
  TrangThaiDoanhNghiep,
} from '../schemas/doanh-nghiep.schema';

export class QueryDoanhNghiepDto {
  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsEnum(LoaiHinhDoanhNghiep)
  loaiHinh?: LoaiHinhDoanhNghiep;

  @IsOptional()
  @IsEnum(TrangThaiDoanhNghiep)
  trangThai?: TrangThaiDoanhNghiep;

  @IsOptional()
  @IsMongoId()
  goiDichVuId?: string;
}
