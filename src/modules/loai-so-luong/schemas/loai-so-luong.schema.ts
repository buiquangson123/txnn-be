import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { DoanhNghiep } from '../../doanh-nghiep/schemas/doanh-nghiep.schema';

export type LoaiSoLuongDocument = LoaiSoLuong & Document;

@Schema({ timestamps: true, collection: 'loai_so_luong' })
export class LoaiSoLuong {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: DoanhNghiep.name,
    required: true,
  })
  doanhNghiep: Types.ObjectId;

  @Prop({ required: true, trim: true })
  tenDonVi: string;
}

export const LoaiSoLuongSchema = SchemaFactory.createForClass(LoaiSoLuong);
