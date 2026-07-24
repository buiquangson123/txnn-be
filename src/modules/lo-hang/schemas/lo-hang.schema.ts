import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { DoanhNghiep } from '../../doanh-nghiep/schemas/doanh-nghiep.schema';
import { LoaiLoHang } from '../../loai-lo-hang/schemas/loai-lo-hang.schema';
import { SanPham } from '../../san-pham/schemas/san-pham.schema';
import { VatTu } from '../../vat-tu/schemas/vat-tu.schema';
import { DonViTrucThuoc } from '../../don-vi-truc-thuoc/schemas/don-vi-truc-thuoc.schema';
import { VungSanXuat } from '../../vung-san-xuat/schemas/vung-san-xuat.schema';
import { NhaXuongKho } from '../../nha-xuong-kho/schemas/nha-xuong-kho.schema';
import { LoaiKhoiLuong } from '../../loai-khoi-luong/schemas/loai-khoi-luong.schema';
import { LoaiSoLuong } from '../../loai-so-luong/schemas/loai-so-luong.schema';

export enum DoiTuongLoHang {
  SAN_PHAM = 'san_pham',
  VAT_TU = 'vat_tu',
}

export type LoHangDocument = LoHang & Document;

@Schema({ timestamps: true, collection: 'lo_hang' })
export class LoHang {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: DoanhNghiep.name,
    required: true,
  })
  doanhNghiep: Types.ObjectId;

  @Prop({ required: true, trim: true, maxlength: 20 })
  soLo: string;

  /** Chỉ có khi doiTuong = san_pham (GTIN + Số lô) */
  @Prop({ trim: true })
  maTruyVetLoHang?: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: LoaiLoHang.name,
    required: true,
  })
  loaiLoHang: Types.ObjectId;

  @Prop({ required: true, trim: true })
  tenLoHang: string;

  @Prop({ trim: true })
  moTa?: string;

  @Prop({ type: [String], default: [] })
  hinhAnh: string[];

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'GiayTo', default: [] })
  giayChungNhan: Types.ObjectId[];

  @Prop({ trim: true })
  quyCachDongGoi?: string;

  @Prop({ type: String, enum: DoiTuongLoHang, required: true })
  doiTuong: DoiTuongLoHang;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: SanPham.name })
  sanPham?: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: VatTu.name })
  vatTu?: Types.ObjectId;

  /** Chỉ có khi doiTuong = san_pham: 01 + N1 + GTIN */
  @Prop({ trim: true })
  maTruyVetVatPham?: string;

  /** 0-8, chỉ áp dụng khi doiTuong = san_pham, cho phép chỉnh tay */
  @Prop({ min: 0, max: 8 })
  n1?: number;

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'LoHang', default: [] })
  nguyenLieuDauVao: Types.ObjectId[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: DonViTrucThuoc.name })
  donViSanXuat?: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: DonViTrucThuoc.name })
  donViPhanPhoi?: Types.ObjectId;

  @Prop({ min: 0 })
  khoiLuong?: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: LoaiKhoiLuong.name })
  loaiKhoiLuong?: Types.ObjectId;

  @Prop({ min: 0 })
  soLuong?: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: LoaiSoLuong.name })
  loaiSoLuong?: Types.ObjectId;

  @Prop()
  ngaySanXuat?: Date;

  @Prop()
  hanSuDung?: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: VungSanXuat.name })
  vungSanXuat?: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: NhaXuongKho.name })
  nhaXuong?: Types.ObjectId;

  @Prop({ trim: true })
  ghiChu?: string;
}

export const LoHangSchema = SchemaFactory.createForClass(LoHang);
