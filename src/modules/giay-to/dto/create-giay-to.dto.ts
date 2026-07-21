import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
} from 'class-validator';
import { DoiTuongGiayTo } from '../schemas/giay-to.schema';

export class CreateGiayToDto {
  @IsString()
  tenGiayTo: string;

  @IsOptional()
  @IsString()
  loaiGiayTo?: string;

  @IsOptional()
  @IsString()
  soHieu?: string;

  @IsOptional()
  @IsDateString()
  ngayCap?: string;

  @IsOptional()
  @IsDateString()
  ngayHetHan?: string;

  @IsOptional()
  @IsString()
  coQuanCap?: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'Vui lòng tải lên ít nhất 1 file đính kèm' })
  @IsString({ each: true })
  fileDinhKem: string[];

  @IsEnum(DoiTuongGiayTo)
  doiTuongApDung: DoiTuongGiayTo;

  @IsMongoId()
  doiTuongId: string;
}
