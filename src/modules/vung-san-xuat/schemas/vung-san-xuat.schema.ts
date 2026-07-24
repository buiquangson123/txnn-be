import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { DoanhNghiep } from '../../doanh-nghiep/schemas/doanh-nghiep.schema';
import { DonViTrucThuoc } from '../../don-vi-truc-thuoc/schemas/don-vi-truc-thuoc.schema';
import { LoaiDiaDiem } from '../../loai-dia-diem/schemas/loai-dia-diem.schema';
import { ThanhVien } from '../../thanh-vien/schemas/thanh-vien.schema';

export type VungSanXuatDocument = VungSanXuat & Document;

@Schema({ timestamps: true, collection: 'vung_san_xuat' })
export class VungSanXuat {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: DoanhNghiep.name,
    required: true,
  })
  doanhNghiep: Types.ObjectId;

  @Prop({ required: true, trim: true })
  tenVungSanXuat: string;

  @Prop({ trim: true })
  diaChi?: string;

  @Prop({ min: 0 })
  dienTich?: number;

  @Prop({ trim: true })
  donViDienTich?: string;

  @Prop({ trim: true })
  moTa?: string;

  @Prop({ trim: true })
  maVungTrongNuoi?: string;

  @Prop({ type: [String], default: [] })
  hinhAnh: string[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: ThanhVien.name })
  nguoiPhuTrach?: Types.ObjectId;

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

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: DonViTrucThuoc.name })
  donViQuanLy?: Types.ObjectId;

  @Prop()
  vido?: number;

  @Prop()
  kinhdo?: number;
}

export const VungSanXuatSchema = SchemaFactory.createForClass(VungSanXuat);
