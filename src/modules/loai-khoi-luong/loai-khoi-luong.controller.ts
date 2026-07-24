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
import { LoaiKhoiLuongService } from './loai-khoi-luong.service';
import { CreateLoaiKhoiLuongDto } from './dto/create-loai-khoi-luong.dto';
import { UpdateLoaiKhoiLuongDto } from './dto/update-loai-khoi-luong.dto';
import { QueryLoaiKhoiLuongDto } from './dto/query-loai-khoi-luong.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { DoanhNghiepId } from '../auth/decorators/doanh-nghiep-id.decorator';
import { Role } from '../../common/enums/role.enum';
import { DoanhNghiepKichHoatGuard } from '../../common/tenant-status/doanh-nghiep-kich-hoat.guard';

@UseGuards(JwtAuthGuard, RolesGuard, DoanhNghiepKichHoatGuard)
@Roles(Role.SYSTEM_ADMIN, Role.ADMIN_DOANH_NGHIEP, Role.QUAN_LY)
@Controller('loai-khoi-luong')
export class LoaiKhoiLuongController {
  constructor(private readonly loaiKhoiLuongService: LoaiKhoiLuongService) {}

  @Post()
  create(
    @DoanhNghiepId() doanhNghiepId: string,
    @Body() dto: CreateLoaiKhoiLuongDto,
  ) {
    return this.loaiKhoiLuongService.create(doanhNghiepId, dto);
  }

  @Get()
  findAll(
    @DoanhNghiepId() doanhNghiepId: string,
    @Query() query: QueryLoaiKhoiLuongDto,
  ) {
    return this.loaiKhoiLuongService.findAll(doanhNghiepId, query);
  }

  @Patch(':id')
  update(
    @DoanhNghiepId() doanhNghiepId: string,
    @Param('id') id: string,
    @Body() dto: UpdateLoaiKhoiLuongDto,
  ) {
    return this.loaiKhoiLuongService.update(doanhNghiepId, id, dto);
  }

  @Delete(':id')
  remove(@DoanhNghiepId() doanhNghiepId: string, @Param('id') id: string) {
    return this.loaiKhoiLuongService.remove(doanhNghiepId, id);
  }
}
