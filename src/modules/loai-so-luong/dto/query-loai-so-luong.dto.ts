import { IsOptional, IsString } from 'class-validator';

export class QueryLoaiSoLuongDto {
  @IsOptional()
  @IsString()
  keyword?: string;
}
