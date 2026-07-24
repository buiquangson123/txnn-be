import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { KenhBanHangLoai } from '../schemas/san-pham.schema';

class KenhBanHangDto {
  @IsEnum(KenhBanHangLoai)
  kenh: KenhBanHangLoai;

  @IsString()
  link: string;
}

export class CreateSanPhamDto {
  @IsString()
  tenSanPham: string;

  @IsString()
  moTa: string;

  @IsOptional()
  @IsString()
  nhomSanPham?: string;

  @IsOptional()
  @IsString()
  quyCach?: string;

  @IsOptional()
  @IsString()
  donViTinh?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  gia?: number;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(3, { message: 'Chỉ được tải tối đa 3 ảnh' })
  @IsString({ each: true })
  hinhAnh?: string[];

  /** Để trống nếu DN chưa có mã GTIN - hệ thống sẽ tự sinh */
  @IsOptional()
  @IsString()
  maGTIN?: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  giayChungNhan?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => KenhBanHangDto)
  kenhBanHang?: KenhBanHangDto[];

  @IsOptional()
  @IsString()
  thanhPhan?: string;

  @IsOptional()
  @IsString()
  congDung?: string;

  @IsOptional()
  @IsString()
  huongDanSuDung?: string;

  @IsOptional()
  @IsString()
  dieuKienBaoQuan?: string;

  @IsOptional()
  @IsMongoId()
  donViSanXuatId?: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  donViPhanPhoiIds?: string[];

  @IsOptional()
  @IsMongoId()
  vungSanXuatId?: string;

  @IsOptional()
  @IsMongoId()
  nhaXuongKhoId?: string;

  @IsOptional()
  @IsMongoId()
  nguoiQuanLyId?: string;
}
