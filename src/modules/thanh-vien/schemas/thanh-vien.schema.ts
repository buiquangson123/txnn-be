import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { Role } from '../../../common/enums/role.enum';
import { DoanhNghiep } from '../../doanh-nghiep/schemas/doanh-nghiep.schema';

export enum TrangThaiThanhVien {
  HOAT_DONG = 'hoat_dong',
  KHOA = 'khoa',
}

export type ThanhVienDocument = ThanhVien & Document;

@Schema({ timestamps: true, collection: 'thanh_vien' })
export class ThanhVien {
  @Prop({ required: true, trim: true })
  hoTen: string;

  @Prop({ required: true, unique: true, trim: true })
  soDienThoai: string;

  @Prop({ required: true, select: false })
  matKhauHash: string;

  @Prop({ trim: true })
  email?: string;

  @Prop({ type: String, enum: Role, required: true })
  vaiTro: Role;

  @Prop({ trim: true })
  donViPhongBan?: string;

  /** Không có giá trị đối với tài khoản System Admin (không thuộc DN nào) */
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: DoanhNghiep.name })
  doanhNghiep?: Types.ObjectId;

  @Prop({
    type: String,
    enum: TrangThaiThanhVien,
    default: TrangThaiThanhVien.HOAT_DONG,
  })
  trangThai: TrangThaiThanhVien;
}

export const ThanhVienSchema = SchemaFactory.createForClass(ThanhVien);
