import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VatTuController } from './vat-tu.controller';
import { VatTuService } from './vat-tu.service';
import { VatTu, VatTuSchema } from './schemas/vat-tu.schema';
import {
  DonViTrucThuoc,
  DonViTrucThuocSchema,
} from '../don-vi-truc-thuoc/schemas/don-vi-truc-thuoc.schema';
import {
  DoanhNghiep,
  DoanhNghiepSchema,
} from '../doanh-nghiep/schemas/doanh-nghiep.schema';
import { DoanhNghiepKichHoatGuard } from '../../common/tenant-status/doanh-nghiep-kich-hoat.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: VatTu.name, schema: VatTuSchema },
      { name: DonViTrucThuoc.name, schema: DonViTrucThuocSchema },
      { name: DoanhNghiep.name, schema: DoanhNghiepSchema },
    ]),
  ],
  controllers: [VatTuController],
  providers: [VatTuService, DoanhNghiepKichHoatGuard],
  exports: [MongooseModule],
})
export class VatTuModule {}
