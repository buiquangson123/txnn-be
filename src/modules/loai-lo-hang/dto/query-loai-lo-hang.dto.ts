import { IsOptional, IsString } from 'class-validator';

export class QueryLoaiLoHangDto {
  @IsOptional()
  @IsString()
  keyword?: string;
}
