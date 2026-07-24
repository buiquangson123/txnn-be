import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { DoanhNghiep } from '../../doanh-nghiep/schemas/doanh-nghiep.schema';
import { LoaiDiaDiem } from '../../loai-dia-diem/schemas/loai-dia-diem.schema';

export type NhaXuongKhoDocument = NhaXuongKho & Document;

@Schema({ timestamps: true, collection: 'nha_xuong_kho' })
export class NhaXuongKho {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: DoanhNghiep.name,
    required: true,
  })
  doanhNghiep: Types.ObjectId;

  @Prop({ required: true, trim: true })
  tenDiaDiem: string;

  @Prop({ trim: true })
  diaChi?: string;

  @Prop({ trim: true })
  nguoiPhuTrach?: string;

  @Prop({ min: 0 })
  congSuat?: number;

  @Prop({ min: 0 })
  dienTich?: number;

  @Prop({ trim: true })
  maCoSoChanNuoiDongGoi?: string;

  @Prop({ type: [String], default: [] })
  hinhAnh: string[];

  @Prop({ trim: true, unique: true, sparse: true })
  maGLN?: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: LoaiDiaDiem.name,
    required: true,
  })
  loaiDiaDiem: Types.ObjectId;

  @Prop({ required: true, unique: true })
  maTruyVetDiaDiem: string;
}

export const NhaXuongKhoSchema = SchemaFactory.createForClass(NhaXuongKho);
