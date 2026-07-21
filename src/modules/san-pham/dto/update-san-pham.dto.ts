import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateSanPhamDto } from './create-san-pham.dto';

export class UpdateSanPhamDto extends PartialType(
  OmitType(CreateSanPhamDto, ['maGTIN'] as const),
) {}
