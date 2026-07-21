import { PartialType } from '@nestjs/mapped-types';
import { CreateVatTuDto } from './create-vat-tu.dto';

export class UpdateVatTuDto extends PartialType(CreateVatTuDto) {}
