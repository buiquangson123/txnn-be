import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateNhaXuongKhoDto } from './create-nha-xuong-kho.dto';

export class UpdateNhaXuongKhoDto extends PartialType(
  OmitType(CreateNhaXuongKhoDto, ['maGLN', 'loaiDiaDiemId'] as const),
) {}
