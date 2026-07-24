import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import {
  DoanhNghiep,
  LoaiHinhDoanhNghiep,
} from '../../doanh-nghiep/schemas/doanh-nghiep.schema';
import { LoaiDiaDiem } from '../../loai-dia-diem/schemas/loai-dia-diem.schema';

export enum TrangThaiLienKet {
  DANG_LIEN_KET = 'dang_lien_ket',
  NGUNG_LIEN_KET = 'ngung_lien_ket',
}

export enum VaiTroDonViLienKet {
  NHA_CUNG_CAP_NGUYEN_LIEU = 'nha_cung_cap_nguyen_lieu',
  DON_VI_SAN_XUAT = 'don_vi_san_xuat',
  DON_VI_GIA_CONG = 'don_vi_gia_cong',
  DON_VI_DONG_GOI = 'don_vi_dong_goi',
  DON_VI_VAN_CHUYEN = 'don_vi_van_chuyen',
  NHA_PHAN_PHOI = 'nha_phan_phoi',
  DAI_LY_BAN_LE = 'dai_ly_ban_le',
  DON_VI_KIEM_NGHIEM = 'don_vi_kiem_nghiem',
  DON_VI_CHUNG_NHAN = 'don_vi_chung_nhan',
  CO_QUAN_QUAN_LY = 'co_quan_quan_ly',
  DON_VI_DICH_VU_KHAC = 'don_vi_dich_vu_khac',
}

export type DonViTrucThuocDocument = DonViTrucThuoc & Document;

@Schema({ timestamps: true, collection: 'don_vi_truc_thuoc' })
export class DonViTrucThuoc {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: DoanhNghiep.name,
    required: true,
  })
  doanhNghiep: Types.ObjectId;

  @Prop({ required: true, trim: true })
  tenDonVi: string;

  @Prop({ type: String, enum: LoaiHinhDoanhNghiep, required: true })
  loaiHinh: LoaiHinhDoanhNghiep;

  @Prop({ type: [String], enum: VaiTroDonViLienKet, default: [] })
  vaiTro: VaiTroDonViLienKet[];

  @Prop({ trim: true })
  maSoThue?: string;

  @Prop({ trim: true })
  nguoiDaiDien?: string;

  @Prop({ trim: true })
  soDienThoai?: string;

  @Prop({ trim: true })
  diaChi?: string;

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

  /** [Số định danh ứng dụng theo Loại địa điểm] + [GLN] - tự sinh, không cho sửa tay */
  @Prop({ required: true, unique: true })
  maTruyVetDiaDiem: string;

  @Prop({
    type: String,
    enum: TrangThaiLienKet,
    default: TrangThaiLienKet.DANG_LIEN_KET,
  })
  trangThai: TrangThaiLienKet;
}

export const DonViTrucThuocSchema =
  SchemaFactory.createForClass(DonViTrucThuoc);
