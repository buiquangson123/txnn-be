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
import { DoanhNghiepId } from '../auth/decorators/doanh-nghiep-id.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/jwt-payload.interface';
import { Role } from '../../common/enums/role.enum';
import { DoiTuongNhatKy } from './schemas/nhat-ky-truy-xuat.schema';
import { DoanhNghiepKichHoatGuard } from '../../common/tenant-status/doanh-nghiep-kich-hoat.guard';

@Controller('nhat-ky-truy-xuat')
export class NhatKyTruyXuatController {
  constructor(private readonly nhatKyTruyXuatService: NhatKyTruyXuatService) {}

  /** Endpoint công khai cho web hiển thị truy xuất - không cần đăng nhập */
  @Get('public')
  layCongKhai(
    @Query('doiTuongLienQuan') doiTuongLienQuan: DoiTuongNhatKy,
    @Query('doiTuongId') doiTuongId: string,
  ) {
    return this.nhatKyTruyXuatService.layNhatKyCongKhai(
      doiTuongLienQuan,
      doiTuongId,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard, DoanhNghiepKichHoatGuard)
  @Roles(
    Role.SYSTEM_ADMIN,
    Role.ADMIN_DOANH_NGHIEP,
    Role.QUAN_LY,
    Role.NHAN_VIEN,
  )
  @Post()
  create(
    @DoanhNghiepId() doanhNghiepId: string,
    @Body() dto: CreateNhatKyTruyXuatDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.nhatKyTruyXuatService.create(doanhNghiepId, dto, user.sub);
  }

  @UseGuards(JwtAuthGuard, RolesGuard, DoanhNghiepKichHoatGuard)
  @Roles(
    Role.SYSTEM_ADMIN,
    Role.ADMIN_DOANH_NGHIEP,
    Role.QUAN_LY,
    Role.NHAN_VIEN,
  )
  @Get()
  findAll(
    @DoanhNghiepId() doanhNghiepId: string,
    @Query() query: QueryNhatKyTruyXuatDto,
  ) {
    return this.nhatKyTruyXuatService.findAll(doanhNghiepId, query);
  }

  @UseGuards(JwtAuthGuard, RolesGuard, DoanhNghiepKichHoatGuard)
  @Roles(
    Role.SYSTEM_ADMIN,
    Role.ADMIN_DOANH_NGHIEP,
    Role.QUAN_LY,
    Role.NHAN_VIEN,
  )
  @Get(':id')
  findOne(@DoanhNghiepId() doanhNghiepId: string, @Param('id') id: string) {
    return this.nhatKyTruyXuatService.findOne(doanhNghiepId, id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard, DoanhNghiepKichHoatGuard)
  @Roles(
    Role.SYSTEM_ADMIN,
    Role.ADMIN_DOANH_NGHIEP,
    Role.QUAN_LY,
    Role.NHAN_VIEN,
  )
  @Patch(':id')
  update(
    @DoanhNghiepId() doanhNghiepId: string,
    @Param('id') id: string,
    @Body() dto: UpdateNhatKyTruyXuatDto,
  ) {
    return this.nhatKyTruyXuatService.update(doanhNghiepId, id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard, DoanhNghiepKichHoatGuard)
  @Roles(Role.SYSTEM_ADMIN, Role.ADMIN_DOANH_NGHIEP, Role.QUAN_LY)
  @Delete(':id')
  remove(@DoanhNghiepId() doanhNghiepId: string, @Param('id') id: string) {
    return this.nhatKyTruyXuatService.remove(doanhNghiepId, id);
  }
}
