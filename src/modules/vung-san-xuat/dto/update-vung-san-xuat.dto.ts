import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateVungSanXuatDto } from './create-vung-san-xuat.dto';

export class UpdateVungSanXuatDto extends PartialType(
  OmitType(CreateVungSanXuatDto, ['maGLN', 'loaiDiaDiemId'] as const),
) {}
