import {
  IsArray,
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';
import { DoiTuongLoHang } from '../schemas/lo-hang.schema';

export class CreateLoHangDto {
  @IsMongoId()
  loaiLoHangId: string;

  @IsOptional()
  @IsString()
  tenLoHang?: string;

  @IsEnum(DoiTuongLoHang)
  doiTuong: DoiTuongLoHang;

  @ValidateIf((o) => o.doiTuong === DoiTuongLoHang.SAN_PHAM)
  @IsMongoId()
  sanPhamId?: string;

  @ValidateIf((o) => o.doiTuong === DoiTuongLoHang.VAT_TU)
  @IsMongoId()
  vatTuId?: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  nguyenLieuDauVao?: string[];

  @IsOptional()
  @IsMongoId()
  donViSanXuatId?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  khoiLuong?: number;

  @IsOptional()
  @IsMongoId()
  loaiKhoiLuongId?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  soLuong?: number;

  @IsOptional()
  @IsMongoId()
  loaiSoLuongId?: string;

  @IsOptional()
  @IsDateString()
  ngaySanXuat?: string;

  @IsOptional()
  @IsDateString()
  hanSuDung?: string;

  @IsOptional()
  @IsMongoId()
  vungSanXuatId?: string;

  @IsOptional()
  @IsMongoId()
  nhaXuongId?: string;

  @IsOptional()
  @IsString()
  ghiChu?: string;
}
