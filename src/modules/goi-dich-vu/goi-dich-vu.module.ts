import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GoiDichVuController } from './goi-dich-vu.controller';
import { GoiDichVuService } from './goi-dich-vu.service';
import { GoiDichVu, GoiDichVuSchema } from './schemas/goi-dich-vu.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GoiDichVu.name, schema: GoiDichVuSchema },
    ]),
  ],
  controllers: [GoiDichVuController],
  providers: [GoiDichVuService],
  exports: [MongooseModule],
})
export class GoiDichVuModule {}
