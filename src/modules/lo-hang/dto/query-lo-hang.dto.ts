import { IsEnum, IsMongoId, IsOptional, IsString } from 'class-validator';
import { DoiTuongLoHang } from '../schemas/lo-hang.schema';

export class QueryLoHangDto {
  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsEnum(DoiTuongLoHang)
  doiTuong?: DoiTuongLoHang;

  @IsOptional()
  @IsMongoId()
  loaiLoHangId?: string;

  @IsOptional()
  @IsMongoId()
  sanPhamId?: string;

  @IsOptional()
  @IsMongoId()
  vatTuId?: string;
}
