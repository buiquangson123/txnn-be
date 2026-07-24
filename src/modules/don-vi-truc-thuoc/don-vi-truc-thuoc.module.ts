import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DonViTrucThuocController } from './don-vi-truc-thuoc.controller';
import { DonViTrucThuocService } from './don-vi-truc-thuoc.service';
import {
  DonViTrucThuoc,
  DonViTrucThuocSchema,
} from './schemas/don-vi-truc-thuoc.schema';
import {
  DoanhNghiep,
  DoanhNghiepSchema,
} from '../doanh-nghiep/schemas/doanh-nghiep.schema';
import {
  LoaiDiaDiem,
  LoaiDiaDiemSchema,
} from '../loai-dia-diem/schemas/loai-dia-diem.schema';
import { DoanhNghiepKichHoatGuard } from '../../common/tenant-status/doanh-nghiep-kich-hoat.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DonViTrucThuoc.name, schema: DonViTrucThuocSchema },
      { name: DoanhNghiep.name, schema: DoanhNghiepSchema },
      { name: LoaiDiaDiem.name, schema: LoaiDiaDiemSchema },
    ]),
  ],
  controllers: [DonViTrucThuocController],
  providers: [DonViTrucThuocService, DoanhNghiepKichHoatGuard],
  exports: [MongooseModule],
})
export class DonViTrucThuocModule {}
