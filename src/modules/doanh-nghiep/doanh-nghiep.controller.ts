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
import { DoanhNghiepService } from './doanh-nghiep.service';
import { CreateDoanhNghiepDto } from './dto/create-doanh-nghiep.dto';
import { UpdateDoanhNghiepDto } from './dto/update-doanh-nghiep.dto';
import { QueryDoanhNghiepDto } from './dto/query-doanh-nghiep.dto';
import { GanGoiDichVuDto } from './dto/gan-goi-dich-vu.dto';
import { TuKichHoatDto } from './dto/tu-kich-hoat.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { DoanhNghiepId } from '../auth/decorators/doanh-nghiep-id.decorator';
import { Role } from '../../common/enums/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SYSTEM_ADMIN)
@Controller('doanh-nghiep')
export class DoanhNghiepController {
  constructor(private readonly doanhNghiepService: DoanhNghiepService) {}

  /**
   * Freemium - Admin DN (mọi trạng thái, kể cả Chưa kích hoạt) xem thông tin DN của chính mình.
   * Đặt trước ':id' để tránh bị route ':id' bắt nhầm.
   */
  @Roles(Role.ADMIN_DOANH_NGHIEP, Role.QUAN_LY, Role.NHAN_VIEN)
  @Get('toi')
  layThongTinCuaToi(@DoanhNghiepId() doanhNghiepId: string) {
    return this.doanhNghiepService.findOne(doanhNghiepId);
  }

  /** Freemium - Admin DN tự chọn gói dịch vụ để mở khóa, không qua System Admin duyệt */
  @Roles(Role.ADMIN_DOANH_NGHIEP)
  @Patch('toi/kich-hoat')
  tuKichHoat(
    @DoanhNghiepId() doanhNghiepId: string,
    @Body() dto: TuKichHoatDto,
  ) {
    return this.doanhNghiepService.tuKichHoat(doanhNghiepId, dto.goiDichVuId);
  }

  @Post()
  create(@Body() dto: CreateDoanhNghiepDto) {
    return this.doanhNghiepService.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryDoanhNghiepDto) {
    return this.doanhNghiepService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.doanhNghiepService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDoanhNghiepDto) {
    return this.doanhNghiepService.update(id, dto);
  }

  @Patch(':id/khoa')
  khoa(@Param('id') id: string) {
    return this.doanhNghiepService.khoa(id);
  }

  @Patch(':id/mo-khoa')
  moKhoa(@Param('id') id: string) {
    return this.doanhNghiepService.moKhoa(id);
  }

  @Patch(':id/gan-goi-dich-vu')
  ganGoiDichVu(@Param('id') id: string, @Body() dto: GanGoiDichVuDto) {
    return this.doanhNghiepService.ganGoiDichVu(id, dto);
  }
}
