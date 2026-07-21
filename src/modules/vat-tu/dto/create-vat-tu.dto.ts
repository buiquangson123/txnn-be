import {
  IsArray,
  IsDateString,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
} from 'class-validator';
import { NhomVatTu } from '../schemas/vat-tu.schema';

export class CreateVatTuDto {
  @IsString()
  tenVatTu: string;

  @IsEnum(NhomVatTu)
  nhomVatTu: NhomVatTu;

  @IsOptional()
  @IsString()
  nhaCungCap?: string;

  @IsOptional()
  @IsString()
  donViTinh?: string;

  @IsOptional()
  @IsString()
  moTa?: string;

  @IsOptional()
  @IsDateString()
  hanSuDung?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  hinhAnh?: string[];

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  giayChungNhan?: string[];
}
