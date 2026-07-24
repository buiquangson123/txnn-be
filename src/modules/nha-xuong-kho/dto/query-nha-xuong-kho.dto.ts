import { IsOptional, IsString } from 'class-validator';

export class QueryNhaXuongKhoDto {
  @IsOptional()
  @IsString()
  keyword?: string;
}
