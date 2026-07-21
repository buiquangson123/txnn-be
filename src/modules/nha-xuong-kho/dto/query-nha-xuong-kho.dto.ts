import { IsEnum, IsOptional, IsString } from 'class-validator';
import { LoaiDiaDiemNoiBo } from '../schemas/nha-xuong-kho.schema';

export class QueryNhaXuongKhoDto {
  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsEnum(LoaiDiaDiemNoiBo)
  loaiDiaDiemNoiBo?: LoaiDiaDiemNoiBo;
}
