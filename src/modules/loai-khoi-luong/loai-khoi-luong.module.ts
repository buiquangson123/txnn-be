import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LoaiKhoiLuongController } from './loai-khoi-luong.controller';
import { LoaiKhoiLuongService } from './loai-khoi-luong.service';
import {
  LoaiKhoiLuong,
  LoaiKhoiLuongSchema,
} from './schemas/loai-khoi-luong.schema';
import {
  DoanhNghiep,
  DoanhNghiepSchema,
} from '../doanh-nghiep/schemas/doanh-nghiep.schema';
import { DoanhNghiepKichHoatGuard } from '../../common/tenant-status/doanh-nghiep-kich-hoat.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LoaiKhoiLuong.name, schema: LoaiKhoiLuongSchema },
      { name: DoanhNghiep.name, schema: DoanhNghiepSchema },
    ]),
  ],
  controllers: [LoaiKhoiLuongController],
  providers: [LoaiKhoiLuongService, DoanhNghiepKichHoatGuard],
  exports: [MongooseModule],
})
export class LoaiKhoiLuongModule {}
