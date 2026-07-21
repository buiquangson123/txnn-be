import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { Role } from '../../../common/enums/role.enum';

export class CreateThanhVienDto {
  @IsString()
  hoTen: string;

  @IsString()
  soDienThoai: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsEnum(Role)
  vaiTro: Role;

  @IsOptional()
  @IsString()
  donViPhongBan?: string;

  /** Nếu để trống, hệ thống tự sinh mật khẩu tạm thời và trả về 1 lần trong response */
  @IsOptional()
  @IsString()
  @MinLength(6)
  matKhau?: string;
}
