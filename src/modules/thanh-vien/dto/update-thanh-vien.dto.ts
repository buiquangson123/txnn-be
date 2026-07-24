import { PartialType, OmitType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';
import { Role } from '../../../common/enums/role.enum';
import { CreateThanhVienDto } from './create-thanh-vien.dto';

export class UpdateThanhVienDto extends PartialType(
  OmitType(CreateThanhVienDto, ['matKhau', 'vaiTro'] as const),
) {
  /**
   * Không dùng @IsIn như lúc tạo mới: khi sửa các trường khác của 1 tài khoản Admin DN,
   * form vẫn gửi kèm vaiTro hiện tại (admin_doanh_nghiep) - service sẽ tự chặn việc
   * đổi vai trò SANG admin_doanh_nghiep/system_admin, chỉ DTO validate định dạng enum.
   */
  @IsOptional()
  @IsEnum(Role)
  vaiTro?: Role;
}
