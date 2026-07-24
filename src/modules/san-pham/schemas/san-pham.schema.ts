import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { DoanhNghiep } from '../../doanh-nghiep/schemas/doanh-nghiep.schema';
import { DonViTrucThuoc } from '../../don-vi-truc-thuoc/schemas/don-vi-truc-thuoc.schema';
import { VungSanXuat } from '../../vung-san-xuat/schemas/vung-san-xuat.schema';
import { NhaXuongKho } from '../../nha-xuong-kho/schemas/nha-xuong-kho.schema';
import { ThanhVien } from '../../thanh-vien/schemas/thanh-vien.schema';

export enum TrangThaiSanPham {
  DANG_BAN = 'dang_ban',
  NGUNG_KINH_DOANH = 'ngung_kinh_doanh',
}

export enum KenhBanHangLoai {
  WEBSITE = 'website',
  ZALO = 'zalo',
  FACEBOOK = 'facebook',
  SHOPEE = 'shopee',
  LAZADA = 'lazada',
  TIKTOK = 'tiktok',
}

@Schema({ _id: false })
export class KenhBanHang {
  @Prop({ type: String, enum: KenhBanHangLoai, required: true })
  kenh: KenhBanHangLoai;

  @Prop({ required: true, trim: true })
  link: string;
}

export const KenhBanHangSchema = SchemaFactory.createForClass(KenhBanHang);

export type SanPhamDocument = SanPham & Document;

@Schema({ timestamps: true, collection: 'san_pham' })
export class SanPham {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: DoanhNghiep.name,
    required: true,
  })
  doanhNghiep: Types.ObjectId;

  @Prop({ required: true, trim: true })
  tenSanPham: string;

  @Prop({ required: true, trim: true })
  moTa: string;

  @Prop({ trim: true })
  nhomSanPham?: string;

  @Prop({ trim: true })
  quyCach?: string;

  @Prop({ trim: true })
  donViTinh?: string;

  @Prop({ min: 0 })
  gia?: number;

  @Prop({ type: [String], default: [] })
  hinhAnh: string[];

  @Prop({ trim: true, unique: true, sparse: true })
  maGTIN?: string;

  /** [01] + [N1=0] + [GTIN] tại thời điểm tạo sản phẩm - mỗi lô hàng tạo sau có thể có N1 riêng */
  @Prop({ required: true, unique: true })
  maTruyVetVatPham: string;

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'GiayTo', default: [] })
  giayChungNhan: Types.ObjectId[];

  @Prop({ type: [KenhBanHangSchema], default: [] })
  kenhBanHang: KenhBanHang[];

  @Prop({ trim: true })
  thanhPhan?: string;

  @Prop({ trim: true })
  congDung?: string;

  @Prop({ trim: true })
  huongDanSuDung?: string;

  @Prop({ trim: true })
  dieuKienBaoQuan?: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: DonViTrucThuoc.name })
  donViSanXuat?: Types.ObjectId;

  @Prop({
    type: [MongooseSchema.Types.ObjectId],
    ref: DonViTrucThuoc.name,
    default: [],
  })
  donViPhanPhoi: Types.ObjectId[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: VungSanXuat.name })
  vungSanXuat?: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: NhaXuongKho.name })
  nhaXuongKho?: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: ThanhVien.name })
  nguoiQuanLy?: Types.ObjectId;

  /** Người tạo sản phẩm - phục vụ cột "người tạo" trên bảng danh sách */
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: ThanhVien.name })
  nguoiTao?: Types.ObjectId;

  /** Luôn = 0 cho tới khi trang public quét QR thật được kết nối (xem CLAUDE.md) */
  @Prop({ default: 0 })
  luotQuet: number;

  @Prop({
    type: String,
    enum: TrangThaiSanPham,
    default: TrangThaiSanPham.DANG_BAN,
  })
  trangThai: TrangThaiSanPham;
}

export const SanPhamSchema = SchemaFactory.createForClass(SanPham);
