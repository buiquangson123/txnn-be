import { PartialType } from '@nestjs/mapped-types';
import { CreateLoaiSoLuongDto } from './create-loai-so-luong.dto';

export class UpdateLoaiSoLuongDto extends PartialType(CreateLoaiSoLuongDto) {}
