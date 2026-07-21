import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GiayToController } from './giay-to.controller';
import { GiayToService } from './giay-to.service';
import { GiayTo, GiayToSchema } from './schemas/giay-to.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: GiayTo.name, schema: GiayToSchema }])],
  controllers: [GiayToController],
  providers: [GiayToService],
  exports: [MongooseModule],
})
export class GiayToModule {}
