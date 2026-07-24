import {
  ArrayMaxSize,
  IsArray,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateVungSanXuatDto {
  @IsString()
  tenVungSanXuat: string;

  @IsOptional()
  @IsString()
  diaChi?: string;

  @IsOptional()
  @IsNumber()
  dienTich?: number;

  @IsOptional()
  @IsString()
  donViDienTich?: string;

  @IsOptional()
  @IsString()
  moTa?: string;

  @IsOptional()
  @IsString()
  maVungTrongNuoi?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(5)
  @IsString({ each: true })
  hinhAnh?: string[];

  @IsOptional()
  @IsMongoId()
  nguoiPhuTrachId?: string;

  /** Để trống nếu DN chưa có mã GLN - hệ thống sẽ tự sinh */
  @IsOptional()
  @IsString()
  maGLN?: string;

  @IsMongoId()
  loaiDiaDiemId: string;

  @IsOptional()
  @IsMongoId()
  donViQuanLyId?: string;

  @IsOptional()
  @IsNumber()
  vido?: number;

  @IsOptional()
  @IsNumber()
  kinhdo?: number;
}
