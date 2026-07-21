import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateLoHangDto } from './create-lo-hang.dto';

export class UpdateLoHangDto extends PartialType(
  OmitType(CreateLoHangDto, [
    'loaiLoHangId',
    'doiTuong',
    'sanPhamId',
    'vatTuId',
    'nguyenLieuDauVao',
  ] as const),
) {}
