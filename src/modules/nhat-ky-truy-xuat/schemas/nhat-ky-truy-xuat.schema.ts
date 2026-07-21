import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { DoanhNghiep } from '../../doanh-nghiep/schemas/doanh-nghiep.schema';
import { ThanhVien } from '../../thanh-vien/schemas/thanh-vien.schema';
import { LoaiLoHang } from '../../loai-lo-hang/schemas/loai-lo-hang.schema';

export enum LoaiDiaDiemThucHien {
  VUNG_SAN_XUAT = 'vung_san_xuat',
  NHA_XUONG = 'nha_xuong',
}

export enum DoiTuongNhatKy {
  SAN_PHAM = 'san_pham',
  LO_HANG = 'lo_hang',
}

export type NhatKyTruyXuatDocument = NhatKyTruyXuat & Document;

@Schema({ timestamps: true, collection: 'nhat_ky_truy_xuat' })
export class NhatKyTruyXuat {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: DoanhNghiep.name, required: true })
  doanhNghiep: Types.ObjectId;

  @Prop({ required: true })
  thoiGianThucHien: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: ThanhVien.name, required: true })
  nguoiThucHien: Types.ObjectId;

  @Prop({ required: true, trim: true })
  noiDungCongViec: string;

  @Prop({ type: [String], default: [] })
  hinhAnhTaiLieu: string[];

  @Prop({ type: String, enum: LoaiDiaDiemThucHien })
  loaiDiaDiemThucHien?: LoaiDiaDiemThucHien;

  @Prop({ type: MongooseSchema.Types.ObjectId })
  diaDiemId?: Types.ObjectId;

  @Prop({ type: String, enum: DoiTuongNhatKy, required: true })
  doiTuongLienQuan: DoiTuongNhatKy;

  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  doiTuongId: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: LoaiLoHang.name })
  congDoan?: Types.ObjectId;

  @Prop({ default: true })
  hienThiCongKhai: boolean;
}

export const NhatKyTruyXuatSchema = SchemaFactory.createForClass(NhatKyTruyXuat);
