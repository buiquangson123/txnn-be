import {
  IsEmail,
  IsEnum,
  IsIn,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { Role } from '../../../common/enums/role.enum';
import { ChucDanhThanhVien } from '../schemas/thanh-vien.schema';

/** Admin DN chỉ được tạo qua DoanhNghiepService.taoAdminDauTien - không tạo qua form này */
const VAI_TRO_CO_THE_TAO = [Role.QUAN_LY, Role.NHAN_VIEN] as const;

export class CreateThanhVienDto {
  @IsString()
  hoTen: string;

  @Matches(/^0\d{9}$/, {
    message: 'Số điện thoại phải gồm đúng 10 số và bắt đầu bằng số 0',
  })
  soDienThoai: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsIn(VAI_TRO_CO_THE_TAO)
  vaiTro: Role;

  @IsOptional()
  @IsEnum(ChucDanhThanhVien)
  chucDanh?: ChucDanhThanhVien;

  @IsOptional()
  @IsString()
  donViPhongBan?: string;

  /** Nếu để trống, hệ thống tự sinh mật khẩu tạm thời và trả về 1 lần trong response */
  @IsOptional()
  @IsString()
  @MinLength(6)
  matKhau?: string;
}
