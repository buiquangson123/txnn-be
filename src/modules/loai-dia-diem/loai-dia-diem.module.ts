import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LoaiDiaDiemController } from './loai-dia-diem.controller';
import { LoaiDiaDiemService } from './loai-dia-diem.service';
import { LoaiDiaDiem, LoaiDiaDiemSchema } from './schemas/loai-dia-diem.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LoaiDiaDiem.name, schema: LoaiDiaDiemSchema },
    ]),
  ],
  controllers: [LoaiDiaDiemController],
  providers: [LoaiDiaDiemService],
  exports: [MongooseModule],
})
export class LoaiDiaDiemModule {}
