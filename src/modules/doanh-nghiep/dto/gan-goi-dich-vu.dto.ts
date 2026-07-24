import { IsDateString, IsMongoId } from 'class-validator';

export class GanGoiDichVuDto {
  @IsMongoId()
  goiDichVuId: string;

  @IsDateString()
  ngayBatDau: string;

  @IsDateString()
  ngayKetThuc: string;
}
