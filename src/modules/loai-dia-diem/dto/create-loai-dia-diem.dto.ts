import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateLoaiDiaDiemDto {
  @IsString()
  maAI: string;

  @IsString()
  tenChuThich: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  thuTuHienThi?: number;
}
