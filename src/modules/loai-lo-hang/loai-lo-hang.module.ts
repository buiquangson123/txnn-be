import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LoaiLoHangController } from './loai-lo-hang.controller';
import { LoaiLoHangService } from './loai-lo-hang.service';
import { LoaiLoHang, LoaiLoHangSchema } from './schemas/loai-lo-hang.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: LoaiLoHang.name, schema: LoaiLoHangSchema }]),
  ],
  controllers: [LoaiLoHangController],
  providers: [LoaiLoHangService],
  exports: [MongooseModule],
})
export class LoaiLoHangModule {}
