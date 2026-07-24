import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DoanhNghiepController } from './doanh-nghiep.controller';
import { DoanhNghiepService } from './doanh-nghiep.service';
import { DoanhNghiep, DoanhNghiepSchema } from './schemas/doanh-nghiep.schema';
import { GoiDichVuModule } from '../goi-dich-vu/goi-dich-vu.module';
import { ThanhVienModule } from '../thanh-vien/thanh-vien.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DoanhNghiep.name, schema: DoanhNghiepSchema },
    ]),
    GoiDichVuModule,
    ThanhVienModule,
  ],
  controllers: [DoanhNghiepController],
  providers: [DoanhNghiepService],
  exports: [MongooseModule, DoanhNghiepService],
})
export class DoanhNghiepModule {}
