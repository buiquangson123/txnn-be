import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { DoanhNghiep } from '../../doanh-nghiep/schemas/doanh-nghiep.schema';

export type GiayToDocument = GiayTo & Document;

@Schema({ timestamps: true, collection: 'giay_to' })
export class GiayTo {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: DoanhNghiep.name,
    required: true,
  })
  doanhNghiep: Types.ObjectId;

  @Prop({ required: true, trim: true })
  tenGiayTo: string;

  @Prop({ trim: true })
  loaiGiayTo?: string;

  @Prop({ trim: true })
  soHieu?: string;

  @Prop()
  ngayCap?: Date;

  @Prop()
  ngayHetHan?: Date;

  @Prop({ trim: true })
  coQuanCap?: string;

  @Prop({ type: [String], required: true })
  fileDinhKem: string[];
}

export const GiayToSchema = SchemaFactory.createForClass(GiayTo);
