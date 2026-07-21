import { PartialType } from '@nestjs/mapped-types';
import { CreateGoiDichVuDto } from './create-goi-dich-vu.dto';

export class UpdateGoiDichVuDto extends PartialType(CreateGoiDichVuDto) {}
