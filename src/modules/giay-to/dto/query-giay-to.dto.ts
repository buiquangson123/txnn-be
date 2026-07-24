import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryGiayToDto {
  @IsOptional()
  @IsString()
  keyword?: string;

  /** Lọc các giấy tờ sắp hết hạn trong N ngày tới */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sapHetHanTrongNgay?: number;
}
