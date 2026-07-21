import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateThanhVienDto } from './create-thanh-vien.dto';

export class UpdateThanhVienDto extends PartialType(
  OmitType(CreateThanhVienDto, ['matKhau'] as const),
) {}
