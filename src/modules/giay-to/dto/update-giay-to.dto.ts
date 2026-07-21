import { PartialType } from '@nestjs/mapped-types';
import { CreateGiayToDto } from './create-giay-to.dto';

export class UpdateGiayToDto extends PartialType(CreateGiayToDto) {}
