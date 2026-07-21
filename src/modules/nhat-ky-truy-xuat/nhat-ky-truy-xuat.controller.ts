import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { NhatKyTruyXuatService } from './nhat-ky-truy-xuat.service';
import { CreateNhatKyTruyXuatDto } from './dto/create-nhat-ky-truy-xuat.dto';
import { UpdateNhatKyTruyXuatDto } from './dto/update-nhat-ky-truy-xuat.dto';
import { QueryNhatKyTruyXuatDto } from './dto/query-nhat-ky-truy-xuat.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { Role } from '../../common/enums/role.enum';
import { DoiTuongNhatKy } from './schemas/nhat-ky-truy-xuat.schema';

@Controller('nhat-ky-truy-xuat')
export class NhatKyTruyXuatController {
  constructor(private readonly nhatKyTruyXuatService: NhatKyTruyXuatService) {}

  /** Endpoint công khai cho web hiển thị truy xuất - không cần đăng nhập */
  @Get('public')
  layCongKhai(
    @Query('doiTuongLienQuan') doiTuongLienQuan: DoiTuongNhatKy,
    @Query('doiTuongId') doiTuongId: string,
  ) {
    return this.nhatKyTruyXuatService.layNhatKyCongKhai(doiTuongLienQuan, doiTuongId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN_DOANH_NGHIEP, Role.QUAN_LY, Role.NHAN_VIEN)
  @Post()
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreateNhatKyTruyXuatDto) {
    return this.nhatKyTruyXuatService.create(user.doanhNghiepId, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN_DOANH_NGHIEP, Role.QUAN_LY, Role.NHAN_VIEN)
  @Get()
  findAll(@CurrentUser() user: JwtPayload, @Query() query: QueryNhatKyTruyXuatDto) {
    return this.nhatKyTruyXuatService.findAll(user.doanhNghiepId, query);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN_DOANH_NGHIEP, Role.QUAN_LY, Role.NHAN_VIEN)
  @Get(':id')
  findOne(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.nhatKyTruyXuatService.findOne(user.doanhNghiepId, id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN_DOANH_NGHIEP, Role.QUAN_LY, Role.NHAN_VIEN)
  @Patch(':id')
  update(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdateNhatKyTruyXuatDto,
  ) {
    return this.nhatKyTruyXuatService.update(user.doanhNghiepId, id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN_DOANH_NGHIEP, Role.QUAN_LY)
  @Delete(':id')
  remove(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.nhatKyTruyXuatService.remove(user.doanhNghiepId, id);
  }
}
