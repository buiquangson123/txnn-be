import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ThanhVienController } from './thanh-vien.controller';
import { ThanhVienService } from './thanh-vien.service';
import { ThanhVien, ThanhVienSchema } from './schemas/thanh-vien.schema';
import {
  DoanhNghiep,
  DoanhNghiepSchema,
} from '../doanh-nghiep/schemas/doanh-nghiep.schema';
import { DoanhNghiepKichHoatGuard } from '../../common/tenant-status/doanh-nghiep-kich-hoat.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ThanhVien.name, schema: ThanhVienSchema },
      { name: DoanhNghiep.name, schema: DoanhNghiepSchema },
    ]),
  ],
  controllers: [ThanhVienController],
  providers: [ThanhVienService, DoanhNghiepKichHoatGuard],
  exports: [ThanhVienService, MongooseModule],
})
export class ThanhVienModule {}
