import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateLoaiLoHangDto {
  @IsString()
  tenLoaiLo: string;

  /** Nếu để trống, hệ thống tự viết tắt từ tên loại lô */
  @IsOptional()
  @IsString()
  @MaxLength(10)
  vietTat?: string;
}
