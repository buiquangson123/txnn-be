import { ArrayMaxSize, IsArray, IsMongoId, IsOptional, IsString } from 'class-validator';

export class CreateSanPhamDto {
  @IsString()
  tenSanPham: string;

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
}
