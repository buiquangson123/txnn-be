import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { DoanhNghiep } from '../../doanh-nghiep/schemas/doanh-nghiep.schema';

export enum DoiTuongDiaDiemBatBuoc {
  VUNG_SAN_XUAT = 'vung_san_xuat',
  NHA_XUONG = 'nha_xuong',
}

export type LoaiLoHangDocument = LoaiLoHang & Document;

@Schema({ timestamps: true, collection: 'loai_lo_hang' })
export class LoaiLoHang {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: DoanhNghiep.name, required: true })
  doanhNghiep: Types.ObjectId;

  @Prop({ required: true, trim: true })
  tenLoaiLo: string;

  /** In hoa, không dấu, <=10 ký tự - dùng để sinh Số lô (rule.md) */
  @Prop({ required: true, trim: true, maxlength: 10 })
  vietTat: string;

  @Prop({
    type: String,
    enum: DoiTuongDiaDiemBatBuoc,
    required: true,
  })
  doiTuongDiaDiemBatBuoc: DoiTuongDiaDiemBatBuoc;
}

export const LoaiLoHangSchema = SchemaFactory.createForClass(LoaiLoHang);
