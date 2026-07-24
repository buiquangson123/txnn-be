import { IsMongoId } from 'class-validator';

export class TuKichHoatDto {
  @IsMongoId()
  goiDichVuId: string;
}
