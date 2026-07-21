import { PartialType } from '@nestjs/mapped-types';
import { CreateLoaiLoHangDto } from './create-loai-lo-hang.dto';

export class UpdateLoaiLoHangDto extends PartialType(CreateLoaiLoHangDto) {}
