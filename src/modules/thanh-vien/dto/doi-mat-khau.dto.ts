import { IsString, MinLength } from 'class-validator';

export class DoiMatKhauDto {
  @IsString()
  matKhauHienTai: string;

  @IsString()
  @MinLength(6)
  matKhauMoi: string;
}
