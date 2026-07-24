import {
  ArrayMaxSize,
  IsArray,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateNhaXuongKhoDto {
  @IsString()
  tenDiaDiem: string;

  @IsOptional()
  @IsString()
  diaChi?: string;

  @IsOptional()
  @IsString()
  nguoiPhuTrach?: string;

  @IsOptional()
  @IsNumber()
  congSuat?: number;

  @IsOptional()
  @IsNumber()
  dienTich?: number;

  @IsOptional()
  @IsString()
  maCoSoChanNuoiDongGoi?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(5)
  @IsString({ each: true })
  hinhAnh?: string[];

  /** Để trống nếu DN chưa có mã GLN - hệ thống sẽ tự sinh */
  @IsOptional()
  @IsString()
  maGLN?: string;

  @IsMongoId()
  loaiDiaDiemId: string;
}
