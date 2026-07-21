import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NhaXuongKhoController } from './nha-xuong-kho.controller';
import { NhaXuongKhoService } from './nha-xuong-kho.service';
import { NhaXuongKho, NhaXuongKhoSchema } from './schemas/nha-xuong-kho.schema';
import { DoanhNghiep, DoanhNghiepSchema } from '../doanh-nghiep/schemas/doanh-nghiep.schema';
import { LoaiDiaDiem, LoaiDiaDiemSchema } from '../loai-dia-diem/schemas/loai-dia-diem.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NhaXuongKho.name, schema: NhaXuongKhoSchema },
      { name: DoanhNghiep.name, schema: DoanhNghiepSchema },
      { name: LoaiDiaDiem.name, schema: LoaiDiaDiemSchema },
    ]),
  ],
  controllers: [NhaXuongKhoController],
  providers: [NhaXuongKhoService],
  exports: [MongooseModule],
})
export class NhaXuongKhoModule {}
