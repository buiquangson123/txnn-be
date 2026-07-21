import { PartialType } from '@nestjs/mapped-types';
import { CreateDonViTrucThuocDto } from './create-don-vi-truc-thuoc.dto';

export class UpdateDonViTrucThuocDto extends PartialType(CreateDonViTrucThuocDto) {}
