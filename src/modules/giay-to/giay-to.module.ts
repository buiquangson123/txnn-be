import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GiayToController } from './giay-to.controller';
import { GiayToService } from './giay-to.service';
import { GiayTo, GiayToSchema } from './schemas/giay-to.schema';
import {
  DoanhNghiep,
  DoanhNghiepSchema,
} from '../doanh-nghiep/schemas/doanh-nghiep.schema';
import { DoanhNghiepKichHoatGuard } from '../../common/tenant-status/doanh-nghiep-kich-hoat.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GiayTo.name, schema: GiayToSchema },
      { name: DoanhNghiep.name, schema: DoanhNghiepSchema },
    ]),
  ],
  controllers: [GiayToController],
  providers: [GiayToService, DoanhNghiepKichHoatGuard],
  exports: [MongooseModule],
})
export class GiayToModule {}
