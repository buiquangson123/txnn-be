import { IsOptional, IsString } from 'class-validator';

export class QueryLoaiKhoiLuongDto {
  @IsOptional()
  @IsString()
  keyword?: string;
}
