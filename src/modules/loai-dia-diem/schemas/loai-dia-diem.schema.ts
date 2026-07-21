import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LoaiDiaDiemDocument = LoaiDiaDiem & Document;

@Schema({ timestamps: true, collection: 'loai_dia_diem' })
export class LoaiDiaDiem {
  /** Số định danh ứng dụng GS1, VD: "410"-"417" */
  @Prop({ required: true, unique: true, trim: true })
  maAI: string;

  @Prop({ required: true, trim: true })
  tenChuThich: string;

  @Prop({ default: 0 })
  thuTuHienThi: number;
}

export const LoaiDiaDiemSchema = SchemaFactory.createForClass(LoaiDiaDiem);
