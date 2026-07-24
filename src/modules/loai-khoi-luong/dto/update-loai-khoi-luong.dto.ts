import { PartialType } from '@nestjs/mapped-types';
import { CreateLoaiKhoiLuongDto } from './create-loai-khoi-luong.dto';

export class UpdateLoaiKhoiLuongDto extends PartialType(
  CreateLoaiKhoiLuongDto,
) {}
