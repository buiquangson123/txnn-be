import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { DoanhNghiep } from '../../doanh-nghiep/schemas/doanh-nghiep.schema';

export enum TrangThaiSanPham {
  DANG_BAN = 'dang_ban',
  NGUNG_KINH_DOANH = 'ngung_kinh_doanh',
}

export type SanPhamDocument = SanPham & Document;

@Schema({ timestamps: true, collection: 'san_pham' })
export class SanPham {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: DoanhNghiep.name, required: true })
  doanhNghiep: Types.ObjectId;

  @Prop({ required: true, trim: true })
  tenSanPham: string;

  @Prop({ trim: true })
  nhomSanPham?: string;

  @Prop({ trim: true })
  quyCach?: string;

  @Prop({ trim: true })
  donViTinh?: string;

  @Prop({ type: [String], default: [] })
  hinhAnh: string[];

  @Prop({ trim: true, unique: true, sparse: true })
  maGTIN?: string;

  /** [01] + [N1=0] + [GTIN] tại thời điểm tạo sản phẩm - mỗi lô hàng tạo sau có thể có N1 riêng */
  @Prop({ required: true, unique: true })
  maTruyVetVatPham: string;

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'GiayTo', default: [] })
  giayChungNhan: Types.ObjectId[];

  @Prop({
    type: String,
    enum: TrangThaiSanPham,
    default: TrangThaiSanPham.DANG_BAN,
  })
  trangThai: TrangThaiSanPham;
}

export const SanPhamSchema = SchemaFactory.createForClass(SanPham);
