import { IsString } from 'class-validator';

export class CreateLoaiKhoiLuongDto {
  @IsString()
  tenDonVi: string;
}
