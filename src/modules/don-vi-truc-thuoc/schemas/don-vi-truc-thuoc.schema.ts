import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { DoanhNghiep, LoaiHinhDoanhNghiep } from '../../doanh-nghiep/schemas/doanh-nghiep.schema';

export enum TrangThaiLienKet {
  DANG_LIEN_KET = 'dang_lien_ket',
  NGUNG_LIEN_KET = 'ngung_lien_ket',
}

export type DonViTrucThuocDocument = DonViTrucThuoc & Document;

@Schema({ timestamps: true, collection: 'don_vi_truc_thuoc' })
export class DonViTrucThuoc {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: DoanhNghiep.name, required: true })
  doanhNghiep: Types.ObjectId;

  @Prop({ required: true, trim: true })
  tenDonVi: string;

  @Prop({ type: String, enum: LoaiHinhDoanhNghiep, required: true })
  loaiHinh: LoaiHinhDoanhNghiep;

  @Prop({ trim: true })
  maSoThueHoacMaDangKy?: string;

  @Prop({ trim: true })
  nguoiDaiDien?: string;

  @Prop({ trim: true })
  soDienThoai?: string;

  @Prop({ trim: true })
  diaChi?: string;

  @Prop({
    type: String,
    enum: TrangThaiLienKet,
    default: TrangThaiLienKet.DANG_LIEN_KET,
  })
  trangThai: TrangThaiLienKet;
}

export const DonViTrucThuocSchema = SchemaFactory.createForClass(DonViTrucThuoc);
