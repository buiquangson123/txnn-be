import { IsString } from 'class-validator';

export class CreateLoaiSoLuongDto {
  @IsString()
  tenDonVi: string;
}
