import { IsEnum, IsISO8601, IsMongoId, IsOptional } from 'class-validator';
import { DoiTuongNhatKy } from '../schemas/nhat-ky-truy-xuat.schema';

export class QueryNhatKyTruyXuatDto {
  @IsOptional()
  @IsEnum(DoiTuongNhatKy)
  doiTuongLienQuan?: DoiTuongNhatKy;

  @IsOptional()
  @IsMongoId()
  doiTuongId?: string;

  @IsOptional()
  @IsMongoId()
  nguoiThucHienId?: string;

  @IsOptional()
  @IsISO8601()
  tuNgay?: string;

  @IsOptional()
  @IsISO8601()
  denNgay?: string;
}
