import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { DoanhNghiep } from '../../doanh-nghiep/schemas/doanh-nghiep.schema';
import { ThanhVien } from '../../thanh-vien/schemas/thanh-vien.schema';
import { VungSanXuat } from '../../vung-san-xuat/schemas/vung-san-xuat.schema';
import { NhaXuongKho } from '../../nha-xuong-kho/schemas/nha-xuong-kho.schema';
import { VatTu } from '../../vat-tu/schemas/vat-tu.schema';
import { NganhNghe } from '../nganh-nghe.constant';

export enum DoiTuongNhatKy {
  SAN_PHAM = 'san_pham',
  LO_HANG = 'lo_hang',
}

export type NhatKyTruyXuatDocument = NhatKyTruyXuat & Document;

@Schema({ timestamps: true, collection: 'nhat_ky_truy_xuat' })
export class NhatKyTruyXuat {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: DoanhNghiep.name,
    required: true,
  })
  doanhNghiep: Types.ObjectId;

  /** Tự động = thời điểm tạo nhật ký, không cho sửa tay */
  @Prop({ required: true })
  thoiGianThucHien: Date;

  /** Tự động = người tạo nhật ký, không cho sửa tay */
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: ThanhVien.name,
    required: true,
  })
  nguoiThucHien: Types.ObjectId;

  @Prop({ type: String, enum: NganhNghe, required: true })
  nganhNghe: NganhNghe;

  /** Chỉ có giá trị khi nganhNghe = KHAC */
  @Prop({ trim: true })
  nganhNgheKhac?: string;

  /** Tên công đoạn - chọn từ danh sách tĩnh của ngành hoặc tự nhập (chọn "Khác") */
  @Prop({ required: true, trim: true })
  congDoanTen: string;

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: VatTu.name, default: [] })
  vatTu: Types.ObjectId[];

  @Prop({ required: true, trim: true })
  noiDungCongViec: string;

  @Prop({ type: [String], default: [] })
  hinhAnhTaiLieu: string[];

  @Prop({ trim: true })
  ghiChu?: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: VungSanXuat.name })
  vungSanXuat?: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: NhaXuongKho.name })
  nhaXuong?: Types.ObjectId;

  @Prop({ type: String, enum: DoiTuongNhatKy, required: true })
  doiTuongLienQuan: DoiTuongNhatKy;

  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  doiTuongId: Types.ObjectId;

  @Prop({ default: true })
  hienThiCongKhai: boolean;
}

export const NhatKyTruyXuatSchema =
  SchemaFactory.createForClass(NhatKyTruyXuat);
