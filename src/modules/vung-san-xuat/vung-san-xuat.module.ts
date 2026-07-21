import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VungSanXuatController } from './vung-san-xuat.controller';
import { VungSanXuatService } from './vung-san-xuat.service';
import { VungSanXuat, VungSanXuatSchema } from './schemas/vung-san-xuat.schema';
import { DoanhNghiep, DoanhNghiepSchema } from '../doanh-nghiep/schemas/doanh-nghiep.schema';
import { LoaiDiaDiem, LoaiDiaDiemSchema } from '../loai-dia-diem/schemas/loai-dia-diem.schema';
import {
  DonViTrucThuoc,
  DonViTrucThuocSchema,
} from '../don-vi-truc-thuoc/schemas/don-vi-truc-thuoc.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: VungSanXuat.name, schema: VungSanXuatSchema },
      { name: DoanhNghiep.name, schema: DoanhNghiepSchema },
      { name: LoaiDiaDiem.name, schema: LoaiDiaDiemSchema },
      { name: DonViTrucThuoc.name, schema: DonViTrucThuocSchema },
    ]),
  ],
  controllers: [VungSanXuatController],
  providers: [VungSanXuatService],
  exports: [MongooseModule],
})
export class VungSanXuatModule {}
