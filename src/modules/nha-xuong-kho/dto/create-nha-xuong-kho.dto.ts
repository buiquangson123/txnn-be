import { IsEnum, IsMongoId, IsNumber, IsOptional, IsString } from 'class-validator';
import { LoaiDiaDiemNoiBo } from '../schemas/nha-xuong-kho.schema';

export class CreateNhaXuongKhoDto {
  @IsString()
  tenDiaDiem: string;

  @IsOptional()
  @IsString()
  diaChi?: string;

  @IsEnum(LoaiDiaDiemNoiBo)
  loaiDiaDiemNoiBo: LoaiDiaDiemNoiBo;

  @IsOptional()
  @IsString()
  nguoiPhuTrach?: string;

  @IsOptional()
  @IsNumber()
  congSuat?: number;

  /** Để trống nếu DN chưa có mã GLN - hệ thống sẽ tự sinh */
  @IsOptional()
  @IsString()
  maGLN?: string;

  @IsMongoId()
  loaiDiaDiemId: string;
}
