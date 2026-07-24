import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  DoanhNghiep,
  DoanhNghiepSchema,
} from '../../modules/doanh-nghiep/schemas/doanh-nghiep.schema';
import { DoanhNghiepKichHoatGuard } from './doanh-nghiep-kich-hoat.guard';

/**
 * Global để mọi module dùng được DoanhNghiepKichHoatGuard qua @UseGuards(...)
 * mà không cần tự import MongooseModule.forFeature([DoanhNghiep]) riêng.
 */
@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DoanhNghiep.name, schema: DoanhNghiepSchema },
    ]),
  ],
  providers: [DoanhNghiepKichHoatGuard],
  exports: [DoanhNghiepKichHoatGuard],
})
export class TenantStatusModule {}
