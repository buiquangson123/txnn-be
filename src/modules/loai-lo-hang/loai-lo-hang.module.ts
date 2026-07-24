import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LoaiLoHangController } from './loai-lo-hang.controller';
import { LoaiLoHangService } from './loai-lo-hang.service';
import { LoaiLoHang, LoaiLoHangSchema } from './schemas/loai-lo-hang.schema';
import {
  DoanhNghiep,
  DoanhNghiepSchema,
} from '../doanh-nghiep/schemas/doanh-nghiep.schema';
import { DoanhNghiepKichHoatGuard } from '../../common/tenant-status/doanh-nghiep-kich-hoat.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LoaiLoHang.name, schema: LoaiLoHangSchema },
      { name: DoanhNghiep.name, schema: DoanhNghiepSchema },
    ]),
  ],
  controllers: [LoaiLoHangController],
  providers: [LoaiLoHangService, DoanhNghiepKichHoatGuard],
  exports: [MongooseModule],
})
export class LoaiLoHangModule {}
