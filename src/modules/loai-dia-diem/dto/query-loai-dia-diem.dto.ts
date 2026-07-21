import { IsOptional, IsString } from 'class-validator';

export class QueryLoaiDiaDiemDto {
  @IsOptional()
  @IsString()
  keyword?: string;
}
