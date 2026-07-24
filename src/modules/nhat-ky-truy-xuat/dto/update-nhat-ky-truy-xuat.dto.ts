import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateNhatKyTruyXuatDto } from './create-nhat-ky-truy-xuat.dto';

export class UpdateNhatKyTruyXuatDto extends PartialType(
  OmitType(CreateNhatKyTruyXuatDto, [
    'doiTuongLienQuan',
    'doiTuongId',
  ] as const),
) {}
