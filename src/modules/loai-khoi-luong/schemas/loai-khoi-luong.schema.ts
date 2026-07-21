import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { DoanhNghiep } from '../../doanh-nghiep/schemas/doanh-nghiep.schema';

export type LoaiKhoiLuongDocument = LoaiKhoiLuong & Document;

@Schema({ timestamps: true, collection: 'loai_khoi_luong' })
export class LoaiKhoiLuong {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: DoanhNghiep.name, required: true })
  doanhNghiep: Types.ObjectId;

  @Prop({ required: true, trim: true })
  tenDonVi: string;
}

export const LoaiKhoiLuongSchema = SchemaFactory.createForClass(LoaiKhoiLuong);
