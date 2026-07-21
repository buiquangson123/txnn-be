import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SanPhamController } from './san-pham.controller';
import { SanPhamService } from './san-pham.service';
import { SanPham, SanPhamSchema } from './schemas/san-pham.schema';
import { DoanhNghiep, DoanhNghiepSchema } from '../doanh-nghiep/schemas/doanh-nghiep.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SanPham.name, schema: SanPhamSchema },
      { name: DoanhNghiep.name, schema: DoanhNghiepSchema },
    ]),
  ],
  controllers: [SanPhamController],
  providers: [SanPhamService],
  exports: [MongooseModule],
})
export class SanPhamModule {}
