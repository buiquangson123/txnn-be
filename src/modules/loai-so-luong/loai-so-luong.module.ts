import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LoaiSoLuongController } from './loai-so-luong.controller';
import { LoaiSoLuongService } from './loai-so-luong.service';
import { LoaiSoLuong, LoaiSoLuongSchema } from './schemas/loai-so-luong.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: LoaiSoLuong.name, schema: LoaiSoLuongSchema }]),
  ],
  controllers: [LoaiSoLuongController],
  providers: [LoaiSoLuongService],
  exports: [MongooseModule],
})
export class LoaiSoLuongModule {}
