import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ThanhVienService } from './thanh-vien.service';
import { CreateThanhVienDto } from './dto/create-thanh-vien.dto';
import { UpdateThanhVienDto } from './dto/update-thanh-vien.dto';
import { QueryThanhVienDto } from './dto/query-thanh-vien.dto';
import { DoiMatKhauDto } from './dto/doi-mat-khau.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { Role } from '../../common/enums/role.enum';

@UseGuards(JwtAuthGuard)
@Controller('thanh-vien')
export class ThanhVienController {
  constructor(private readonly thanhVienService: ThanhVienService) {}

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN_DOANH_NGHIEP, Role.QUAN_LY)
  @Post()
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreateThanhVienDto) {
    return this.thanhVienService.create(user.doanhNghiepId, dto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN_DOANH_NGHIEP, Role.QUAN_LY)
  @Get()
  findAll(@CurrentUser() user: JwtPayload, @Query() query: QueryThanhVienDto) {
    return this.thanhVienService.findAll(user.doanhNghiepId, query);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN_DOANH_NGHIEP, Role.QUAN_LY)
  @Get(':id')
  findOne(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.thanhVienService.findOne(user.doanhNghiepId, id);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN_DOANH_NGHIEP, Role.QUAN_LY)
  @Patch(':id')
  update(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdateThanhVienDto,
  ) {
    return this.thanhVienService.update(user.doanhNghiepId, id, dto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN_DOANH_NGHIEP, Role.QUAN_LY)
  @Patch(':id/khoa')
  khoa(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.thanhVienService.khoa(user.doanhNghiepId, id);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN_DOANH_NGHIEP, Role.QUAN_LY)
  @Patch(':id/mo-khoa')
  moKhoa(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.thanhVienService.moKhoa(user.doanhNghiepId, id);
  }

  /** Đổi mật khẩu của chính tài khoản đang đăng nhập (Thông tin cá nhân) */
  @Patch('toi/doi-mat-khau')
  doiMatKhauCuaToi(@CurrentUser() user: JwtPayload, @Body() dto: DoiMatKhauDto) {
    return this.thanhVienService.doiMatKhau(user.sub, dto.matKhauHienTai, dto.matKhauMoi);
  }
}
