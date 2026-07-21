import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TrangThaiGoiDichVu } from '../schemas/goi-dich-vu.schema';

export class QueryGoiDichVuDto {
  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsEnum(TrangThaiGoiDichVu)
  trangThai?: TrangThaiGoiDichVu;
}
