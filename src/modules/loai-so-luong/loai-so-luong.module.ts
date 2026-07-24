import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LoaiSoLuongController } from './loai-so-luong.controller';
import { LoaiSoLuongService } from './loai-so-luong.service';
import { LoaiSoLuong, LoaiSoLuongSchema } from './schemas/loai-so-luong.schema';
import {
  DoanhNghiep,
  DoanhNghiepSchema,
} from '../doanh-nghiep/schemas/doanh-nghiep.schema';
import { DoanhNghiepKichHoatGuard } from '../../common/tenant-status/doanh-nghiep-kich-hoat.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LoaiSoLuong.name, schema: LoaiSoLuongSchema },
      { name: DoanhNghiep.name, schema: DoanhNghiepSchema },
    ]),
  ],
  controllers: [LoaiSoLuongController],
  providers: [LoaiSoLuongService, DoanhNghiepKichHoatGuard],
  exports: [MongooseModule],
})
export class LoaiSoLuongModule {}
