import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { Role } from '../../../common/enums/role.enum';
import { DoanhNghiep } from '../../doanh-nghiep/schemas/doanh-nghiep.schema';

export enum TrangThaiThanhVien {
  HOAT_DONG = 'hoat_dong',
  KHOA = 'khoa',
}

/** Chức danh cụ thể của tài khoản Nhân viên - chỉ mang tính mô tả, không ảnh hưởng phân quyền */
export enum ChucDanhThanhVien {
  NHAN_VIEN_KHO = 'nhan_vien_kho',
  NHAN_VIEN_GIAO_HANG = 'nhan_vien_giao_hang',
  NHAN_VIEN_SAN_XUAT = 'nhan_vien_san_xuat',
  NHAN_VIEN_DONG_GOI = 'nhan_vien_dong_goi',
  KY_THUAT_QA_QC = 'ky_thuat_qa_qc',
  NHAN_VIEN_KINH_DOANH = 'nhan_vien_kinh_doanh',
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

  @Prop({ type: String, enum: ChucDanhThanhVien })
  chucDanh?: ChucDanhThanhVien;

  @Prop({ trim: true })
  donViPhongBan?: string;

  /** Không có giá trị đối với tài khoản System Admin (không thuộc DN nào) */
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: DoanhNghiep.name })
  doanhNghiep?: Types.ObjectId;

  /** Người tạo tài khoản này - dùng để giới hạn phạm vi xem của vai trò Quản lý/Nhân viên */
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'ThanhVien' })
  nguoiTao?: Types.ObjectId;

  @Prop({
    type: String,
    enum: TrangThaiThanhVien,
    default: TrangThaiThanhVien.HOAT_DONG,
  })
  trangThai: TrangThaiThanhVien;
}

export const ThanhVienSchema = SchemaFactory.createForClass(ThanhVien);
