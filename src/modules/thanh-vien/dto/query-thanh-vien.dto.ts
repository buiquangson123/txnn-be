import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Role } from '../../../common/enums/role.enum';
import { TrangThaiThanhVien } from '../schemas/thanh-vien.schema';

export class QueryThanhVienDto {
  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsEnum(Role)
  vaiTro?: Role;

  @IsOptional()
  @IsEnum(TrangThaiThanhVien)
  trangThai?: TrangThaiThanhVien;
}
