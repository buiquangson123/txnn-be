import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DonViTrucThuocController } from './don-vi-truc-thuoc.controller';
import { DonViTrucThuocService } from './don-vi-truc-thuoc.service';
import {
  DonViTrucThuoc,
  DonViTrucThuocSchema,
} from './schemas/don-vi-truc-thuoc.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DonViTrucThuoc.name, schema: DonViTrucThuocSchema },
    ]),
  ],
  controllers: [DonViTrucThuocController],
  providers: [DonViTrucThuocService],
  exports: [MongooseModule],
})
export class DonViTrucThuocModule {}
