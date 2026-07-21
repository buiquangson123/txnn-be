import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { DoiTuongNhatKy, LoaiDiaDiemThucHien } from '../schemas/nhat-ky-truy-xuat.schema';

export class CreateNhatKyTruyXuatDto {
  @IsDateString()
  thoiGianThucHien: string;

  @IsMongoId()
  nguoiThucHienId: string;

  @IsString()
  noiDungCongViec: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  hinhAnhTaiLieu?: string[];

  @IsOptional()
  @IsEnum(LoaiDiaDiemThucHien)
  loaiDiaDiemThucHien?: LoaiDiaDiemThucHien;

  @ValidateIf((o) => !!o.loaiDiaDiemThucHien)
  @IsMongoId()
  diaDiemId?: string;

  @IsEnum(DoiTuongNhatKy)
  doiTuongLienQuan: DoiTuongNhatKy;

  @IsMongoId()
  doiTuongId: string;

  @IsOptional()
  @IsMongoId()
  congDoanId?: string;

  @IsOptional()
  @IsBoolean()
  hienThiCongKhai?: boolean;
}
