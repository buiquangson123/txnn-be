import { IsMongoId } from 'class-validator';

export class GanGoiDichVuDto {
  @IsMongoId()
  goiDichVuId: string;
}
