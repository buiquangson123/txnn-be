import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VatTuController } from './vat-tu.controller';
import { VatTuService } from './vat-tu.service';
import { VatTu, VatTuSchema } from './schemas/vat-tu.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: VatTu.name, schema: VatTuSchema }])],
  controllers: [VatTuController],
  providers: [VatTuService],
  exports: [MongooseModule],
})
export class VatTuModule {}
