import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { DoanhNghiep } from '../../doanh-nghiep/schemas/doanh-nghiep.schema';
import { LoaiDiaDiem } from '../../loai-dia-diem/schemas/loai-dia-diem.schema';

export enum LoaiDiaDiemNoiBo {
  NHA_MAY = 'nha_may',
  XUONG_SAN_XUAT = 'xuong_san_xuat',
  KHO_LUU_TRU = 'kho_luu_tru',
}

export type NhaXuongKhoDocument = NhaXuongKho & Document;

@Schema({ timestamps: true, collection: 'nha_xuong_kho' })
export class NhaXuongKho {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: DoanhNghiep.name, required: true })
  doanhNghiep: Types.ObjectId;

  @Prop({ required: true, trim: true })
  tenDiaDiem: string;

  @Prop({ trim: true })
  diaChi?: string;

  @Prop({ type: String, enum: LoaiDiaDiemNoiBo, required: true })
  loaiDiaDiemNoiBo: LoaiDiaDiemNoiBo;

  @Prop({ trim: true })
  nguoiPhuTrach?: string;

  @Prop({ min: 0 })
  congSuat?: number;

  @Prop({ trim: true, unique: true, sparse: true })
  maGLN?: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: LoaiDiaDiem.name, required: true })
  loaiDiaDiem: Types.ObjectId;

  @Prop({ required: true, unique: true })
  maTruyVetDiaDiem: string;
}

export const NhaXuongKhoSchema = SchemaFactory.createForClass(NhaXuongKho);
