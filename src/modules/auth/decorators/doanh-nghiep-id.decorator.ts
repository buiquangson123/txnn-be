import {
  BadRequestException,
  ForbiddenException,
  createParamDecorator,
  type ExecutionContext,
} from '@nestjs/common';
import { Role } from '../../../common/enums/role.enum';
import type { JwtPayload } from '../jwt-payload.interface';

/**
 * Trả về doanhNghiepId để service dùng cho việc lọc dữ liệu theo tenant.
 * - System Admin: bắt buộc truyền qua query `?doanhNghiepId=...` (được thao tác trên mọi DN).
 * - Tài khoản DN: luôn lấy từ token, bỏ qua mọi giá trị client tự truyền (chống chiếm quyền tenant khác).
 */
export const DoanhNghiepId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    const user: JwtPayload = request.user;

    if (user.vaiTro === Role.SYSTEM_ADMIN) {
      const doanhNghiepId = request.query?.doanhNghiepId as string | undefined;
      if (!doanhNghiepId) {
        throw new BadRequestException(
          'System Admin cần chỉ định doanhNghiepId (query param) để thao tác',
        );
      }
      return doanhNghiepId;
    }

    if (!user.doanhNghiepId) {
      throw new ForbiddenException('Tài khoản không thuộc doanh nghiệp nào');
    }
    return user.doanhNghiepId;
  },
);
