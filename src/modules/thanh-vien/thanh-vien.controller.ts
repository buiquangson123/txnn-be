import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ThanhVienService } from './thanh-vien.service';
import { CreateThanhVienDto } from './dto/create-thanh-vien.dto';
import { UpdateThanhVienDto } from './dto/update-thanh-vien.dto';
import { QueryThanhVienDto } from './dto/query-thanh-vien.dto';
import { DoiMatKhauDto } from './dto/doi-mat-khau.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { DoanhNghiepId } from '../auth/decorators/doanh-nghiep-id.decorator';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { Role } from '../../common/enums/role.enum';
import { DoanhNghiepKichHoatGuard } from '../../common/tenant-status/doanh-nghiep-kich-hoat.guard';

@UseGuards(JwtAuthGuard)
@Controller('thanh-vien')
export class ThanhVienController {
  constructor(private readonly thanhVienService: ThanhVienService) {}

  @UseGuards(RolesGuard, DoanhNghiepKichHoatGuard)
  @Roles(Role.SYSTEM_ADMIN, Role.ADMIN_DOANH_NGHIEP, Role.QUAN_LY)
  @Post()
  create(
    @DoanhNghiepId() doanhNghiepId: string,
    @Body() dto: CreateThanhVienDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.thanhVienService.create(doanhNghiepId, dto, user.sub);
  }

  @UseGuards(RolesGuard, DoanhNghiepKichHoatGuard)
  @Roles(Role.SYSTEM_ADMIN, Role.ADMIN_DOANH_NGHIEP, Role.QUAN_LY)
  @Get()
  findAll(
    @DoanhNghiepId() doanhNghiepId: string,
    @Query() query: QueryThanhVienDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.thanhVienService.findAll(doanhNghiepId, query, {
      id: user.sub,
      vaiTro: user.vaiTro,
    });
  }

  @UseGuards(RolesGuard, DoanhNghiepKichHoatGuard)
  @Roles(Role.SYSTEM_ADMIN, Role.ADMIN_DOANH_NGHIEP, Role.QUAN_LY)
  @Get(':id')
  findOne(
    @DoanhNghiepId() doanhNghiepId: string,
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.thanhVienService.findOne(doanhNghiepId, id, {
      id: user.sub,
      vaiTro: user.vaiTro,
    });
  }

  @UseGuards(RolesGuard, DoanhNghiepKichHoatGuard)
  @Roles(Role.SYSTEM_ADMIN, Role.ADMIN_DOANH_NGHIEP, Role.QUAN_LY)
  @Patch(':id')
  update(
    @DoanhNghiepId() doanhNghiepId: string,
    @Param('id') id: string,
    @Body() dto: UpdateThanhVienDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.thanhVienService.update(doanhNghiepId, id, dto, {
      id: user.sub,
      vaiTro: user.vaiTro,
    });
  }

  /** Chỉ Admin DN (và System Admin) mới được khóa/mở khóa tài khoản thành viên */
  @UseGuards(RolesGuard, DoanhNghiepKichHoatGuard)
  @Roles(Role.SYSTEM_ADMIN, Role.ADMIN_DOANH_NGHIEP)
  @Patch(':id/khoa')
  khoa(@DoanhNghiepId() doanhNghiepId: string, @Param('id') id: string) {
    return this.thanhVienService.khoa(doanhNghiepId, id);
  }

  @UseGuards(RolesGuard, DoanhNghiepKichHoatGuard)
  @Roles(Role.SYSTEM_ADMIN, Role.ADMIN_DOANH_NGHIEP)
  @Patch(':id/mo-khoa')
  moKhoa(@DoanhNghiepId() doanhNghiepId: string, @Param('id') id: string) {
    return this.thanhVienService.moKhoa(doanhNghiepId, id);
  }

  /** Đổi mật khẩu của chính tài khoản đang đăng nhập (Thông tin cá nhân) */
  @Patch('toi/doi-mat-khau')
  doiMatKhauCuaToi(
    @CurrentUser() user: JwtPayload,
    @Body() dto: DoiMatKhauDto,
  ) {
    return this.thanhVienService.doiMatKhau(
      user.sub,
      dto.matKhauHienTai,
      dto.matKhauMoi,
    );
  }
}
