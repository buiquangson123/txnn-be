import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class QueryVungSanXuatDto {
  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsMongoId()
  donViQuanLyId?: string;
}
