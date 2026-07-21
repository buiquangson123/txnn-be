import { IsEnum, IsInt, IsMongoId, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { DoiTuongGiayTo } from '../schemas/giay-to.schema';

export class QueryGiayToDto {
  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsEnum(DoiTuongGiayTo)
  doiTuongApDung?: DoiTuongGiayTo;

  @IsOptional()
  @IsMongoId()
  doiTuongId?: string;

  /** Lọc các giấy tờ sắp hết hạn trong N ngày tới */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sapHetHanTrongNgay?: number;
}
