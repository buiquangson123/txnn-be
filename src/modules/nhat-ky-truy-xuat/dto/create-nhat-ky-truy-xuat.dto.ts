import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { DoiTuongNhatKy } from '../schemas/nhat-ky-truy-xuat.schema';
import { NganhNghe } from '../nganh-nghe.constant';

export class CreateNhatKyTruyXuatDto {
  @IsEnum(NganhNghe)
  nganhNghe: NganhNghe;

  @ValidateIf((o) => o.nganhNghe === NganhNghe.KHAC)
  @IsString()
  nganhNgheKhac?: string;

  @IsString()
  congDoanTen: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  vatTu?: string[];

  @IsString()
  noiDungCongViec: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'Vui lòng tải lên ít nhất 1 hình ảnh' })
  @IsString({ each: true })
  hinhAnhTaiLieu: string[];

  @IsOptional()
  @IsString()
  ghiChu?: string;

  @IsOptional()
  @IsMongoId()
  vungSanXuatId?: string;

  @IsOptional()
  @IsMongoId()
  nhaXuongId?: string;

  @IsEnum(DoiTuongNhatKy)
  doiTuongLienQuan: DoiTuongNhatKy;

  @IsMongoId()
  doiTuongId: string;

  @IsOptional()
  @IsBoolean()
  hienThiCongKhai?: boolean;
}
