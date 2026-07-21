import { IsMongoId, IsNumber, IsOptional, IsString } from 'class-validator';

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
  moTa?: string;

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
