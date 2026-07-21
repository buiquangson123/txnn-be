import { PartialType } from '@nestjs/mapped-types';
import { CreateLoaiDiaDiemDto } from './create-loai-dia-diem.dto';

export class UpdateLoaiDiaDiemDto extends PartialType(CreateLoaiDiaDiemDto) {}
