import { IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  soDienThoai: string;

  @IsString()
  matKhau: string;
}
