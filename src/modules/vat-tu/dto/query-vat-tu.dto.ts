import { IsEnum, IsMongoId, IsOptional, IsString } from 'class-validator';
import { NhomVatTu } from '../schemas/vat-tu.schema';

export class QueryVatTuDto {
  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsEnum(NhomVatTu)
  nhomVatTu?: NhomVatTu;

  @IsOptional()
  @IsMongoId()
  nhaCungCapId?: string;
}
