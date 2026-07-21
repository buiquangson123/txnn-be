import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { DoanhNghiep } from '../../doanh-nghiep/schemas/doanh-nghiep.schema';

export enum DoiTuongGiayTo {
  DOANH_NGHIEP = 'doanh_nghiep',
  VUNG_SAN_XUAT = 'vung_san_xuat',
  SAN_PHAM = 'san_pham',
  LO_HANG = 'lo_hang',
}

export type GiayToDocument = GiayTo & Document;

@Schema({ timestamps: true, collection: 'giay_to' })
export class GiayTo {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: DoanhNghiep.name, required: true })
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

  @Prop({ type: String, enum: DoiTuongGiayTo, required: true })
  doiTuongApDung: DoiTuongGiayTo;

  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  doiTuongId: Types.ObjectId;
}

export const GiayToSchema = SchemaFactory.createForClass(GiayTo);
