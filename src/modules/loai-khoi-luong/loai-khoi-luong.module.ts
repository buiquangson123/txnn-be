import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LoaiKhoiLuongController } from './loai-khoi-luong.controller';
import { LoaiKhoiLuongService } from './loai-khoi-luong.service';
import { LoaiKhoiLuong, LoaiKhoiLuongSchema } from './schemas/loai-khoi-luong.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: LoaiKhoiLuong.name, schema: LoaiKhoiLuongSchema }]),
  ],
  controllers: [LoaiKhoiLuongController],
  providers: [LoaiKhoiLuongService],
  exports: [MongooseModule],
})
export class LoaiKhoiLuongModule {}
