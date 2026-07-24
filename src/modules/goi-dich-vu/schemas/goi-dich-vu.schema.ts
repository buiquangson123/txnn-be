import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum TrangThaiGoiDichVu {
  DANG_AP_DUNG = 'dang_ap_dung',
  NGUNG_AP_DUNG = 'ngung_ap_dung',
}

export type GoiDichVuDocument = GoiDichVu & Document;

@Schema({ timestamps: true, collection: 'goi_dich_vu' })
export class GoiDichVu {
  @Prop({ required: true, trim: true })
  tenGoi: string;

  @Prop({ required: true, min: 0 })
  soLuongMaSanPhamToiDa: number;

  @Prop({ min: 0 })
  soLuongThanhVienToiDa?: number;

  @Prop({ min: 0 })
  dungLuongLuuTruMB?: number;

  @Prop({ min: 0 })
  giaGoi?: number;

  @Prop({
    type: String,
    enum: TrangThaiGoiDichVu,
    default: TrangThaiGoiDichVu.DANG_AP_DUNG,
  })
  trangThai: TrangThaiGoiDichVu;

  @Prop({ trim: true })
  ghiChu?: string;
}

export const GoiDichVuSchema = SchemaFactory.createForClass(GoiDichVu);
