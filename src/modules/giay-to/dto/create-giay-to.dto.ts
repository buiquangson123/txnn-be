import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsOptional,
  IsString,
} from 'class-validator';

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
}
