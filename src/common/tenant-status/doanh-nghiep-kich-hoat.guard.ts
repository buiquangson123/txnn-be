import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from '../enums/role.enum';
import { JwtPayload } from '../../modules/auth/jwt-payload.interface';
import {
  DoanhNghiep,
  DoanhNghiepDocument,
  TrangThaiDoanhNghiep,
} from '../../modules/doanh-nghiep/schemas/doanh-nghiep.schema';

/**
 * Chặn mọi thao tác nghiệp vụ (kể cả xem) khi doanh nghiệp đang ở trạng thái
 * "Chưa kích hoạt" hoặc "Khóa" - theo luồng Freemium (new-requirement.md giai đoạn 1,
 * Q1.1: "Vào màn khóa thì không hiển thị thông tin"). System Admin luôn bỏ qua kiểm tra
 * này vì có toàn quyền truy cập mọi DN bất kể trạng thái.
 */
@Injectable()
export class DoanhNghiepKichHoatGuard implements CanActivate {
  constructor(
    @InjectModel(DoanhNghiep.name)
    private readonly doanhNghiepModel: Model<DoanhNghiepDocument>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: JwtPayload = request.user;

    if (!user || user.vaiTro === Role.SYSTEM_ADMIN) {
      return true;
    }
    if (!user.doanhNghiepId) {
      return true;
    }

    const doanhNghiep = await this.doanhNghiepModel
      .findById(user.doanhNghiepId)
      .select('trangThai')
      .exec();
    if (!doanhNghiep) {
      throw new ForbiddenException('Doanh nghiệp không tồn tại');
    }
    if (doanhNghiep.trangThai !== TrangThaiDoanhNghiep.HOAT_DONG) {
      throw new ForbiddenException(
        'Doanh nghiệp chưa kích hoạt hoặc đã bị khóa. Vui lòng đăng ký gói dịch vụ để mở khóa.',
      );
    }
    return true;
  }
}
