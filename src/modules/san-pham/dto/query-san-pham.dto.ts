import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TrangThaiSanPham } from '../schemas/san-pham.schema';

export class QuerySanPhamDto {
  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsString()
  nhomSanPham?: string;

  @IsOptional()
  @IsEnum(TrangThaiSanPham)
  trangThai?: TrangThaiSanPham;
}
