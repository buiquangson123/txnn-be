import { IsString, Matches, MinLength } from 'class-validator';

export class DangKyDoanhNghiepDto {
  @IsString()
  tenDoanhNghiep: string;

  @IsString()
  hoTen: string;

  @Matches(/^0\d{9}$/, {
    message: 'Số điện thoại phải gồm đúng 10 số và bắt đầu bằng số 0',
  })
  soDienThoai: string;

  @IsString()
  @MinLength(6, { message: 'Mật khẩu tối thiểu 6 ký tự' })
  matKhau: string;
}
