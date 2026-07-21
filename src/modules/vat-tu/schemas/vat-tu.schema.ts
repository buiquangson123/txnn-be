import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { DoanhNghiep } from '../../doanh-nghiep/schemas/doanh-nghiep.schema';

export enum NhomVatTu {
  GIONG = 'giong',
  PHAN_BON = 'phan_bon',
  THUOC_BVTV = 'thuoc_bvtv',
  BAO_BI = 'bao_bi',
  NGUYEN_LIEU = 'nguyen_lieu',
  PHU_LIEU = 'phu_lieu',
}

export type VatTuDocument = VatTu & Document;

@Schema({ timestamps: true, collection: 'vat_tu' })
export class VatTu {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: DoanhNghiep.name, required: true })
  doanhNghiep: Types.ObjectId;

  @Prop({ required: true, trim: true })
  tenVatTu: string;

  @Prop({ type: String, enum: NhomVatTu, required: true })
  nhomVatTu: NhomVatTu;

  @Prop({ trim: true })
  nhaCungCap?: string;

  @Prop({ trim: true })
  donViTinh?: string;

  @Prop({ trim: true })
  moTa?: string;

  @Prop()
  hanSuDung?: Date;

  @Prop({ type: [String], default: [] })
  hinhAnh: string[];

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'GiayTo', default: [] })
  giayChungNhan: Types.ObjectId[];
}

export const VatTuSchema = SchemaFactory.createForClass(VatTu);
