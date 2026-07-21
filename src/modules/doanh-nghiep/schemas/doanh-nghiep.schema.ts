import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { GoiDichVu } from '../../goi-dich-vu/schemas/goi-dich-vu.schema';

export enum LoaiHinhDoanhNghiep {
  DOANH_NGHIEP = 'doanh_nghiep',
  HTX = 'htx',
  TO_HOP_TAC = 'to_hop_tac',
}

export enum TrangThaiDoanhNghiep {
  HOAT_DONG = 'hoat_dong',
  KHOA = 'khoa',
  CHO_KICH_HOAT = 'cho_kich_hoat',
}

export type DoanhNghiepDocument = DoanhNghiep & Document;

@Schema({ timestamps: true, _id: false })
export class LichSuGoiDichVu {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: GoiDichVu.name, required: true })
  goiDichVu: Types.ObjectId;

  @Prop({ required: true })
  ngayBatDau: Date;

  @Prop()
  ngayKetThuc?: Date;
}

export const LichSuGoiDichVuSchema = SchemaFactory.createForClass(LichSuGoiDichVu);

@Schema({ timestamps: true, collection: 'doanh_nghiep' })
export class DoanhNghiep {
  @Prop({ required: true, trim: true })
  tenDoanhNghiep: string;

  @Prop({ required: true, unique: true, trim: true })
  maDoanhNghiep: string;

  @Prop({ trim: true })
  maSoThue?: string;

  @Prop({ trim: true })
  diaChi?: string;

  @Prop({ trim: true })
  soDienThoai?: string;

  @Prop({ trim: true })
  email?: string;

  @Prop({ type: String, enum: LoaiHinhDoanhNghiep, required: true })
  loaiHinh: LoaiHinhDoanhNghiep;

  @Prop()
  logo?: string;

  @Prop({
    type: String,
    enum: TrangThaiDoanhNghiep,
    default: TrangThaiDoanhNghiep.CHO_KICH_HOAT,
  })
  trangThai: TrangThaiDoanhNghiep;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: GoiDichVu.name })
  goiDichVu?: Types.ObjectId;

  @Prop()
  ngayBatDauGoi?: Date;

  @Prop()
  ngayKetThucGoi?: Date;

  @Prop({ type: [LichSuGoiDichVuSchema], default: [] })
  lichSuGoiDichVu: LichSuGoiDichVu[];
}

export const DoanhNghiepSchema = SchemaFactory.createForClass(DoanhNghiep);
