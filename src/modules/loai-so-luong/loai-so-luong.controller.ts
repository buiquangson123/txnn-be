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
import { LoaiSoLuongService } from './loai-so-luong.service';
import { CreateLoaiSoLuongDto } from './dto/create-loai-so-luong.dto';
import { UpdateLoaiSoLuongDto } from './dto/update-loai-so-luong.dto';
import { QueryLoaiSoLuongDto } from './dto/query-loai-so-luong.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { DoanhNghiepId } from '../auth/decorators/doanh-nghiep-id.decorator';
import { Role } from '../../common/enums/role.enum';
import { DoanhNghiepKichHoatGuard } from '../../common/tenant-status/doanh-nghiep-kich-hoat.guard';

@UseGuards(JwtAuthGuard, RolesGuard, DoanhNghiepKichHoatGuard)
@Roles(Role.SYSTEM_ADMIN, Role.ADMIN_DOANH_NGHIEP, Role.QUAN_LY)
@Controller('loai-so-luong')
export class LoaiSoLuongController {
  constructor(private readonly loaiSoLuongService: LoaiSoLuongService) {}

  @Post()
  create(
    @DoanhNghiepId() doanhNghiepId: string,
    @Body() dto: CreateLoaiSoLuongDto,
  ) {
    return this.loaiSoLuongService.create(doanhNghiepId, dto);
  }

  @Get()
  findAll(
    @DoanhNghiepId() doanhNghiepId: string,
    @Query() query: QueryLoaiSoLuongDto,
  ) {
    return this.loaiSoLuongService.findAll(doanhNghiepId, query);
  }

  @Patch(':id')
  update(
    @DoanhNghiepId() doanhNghiepId: string,
    @Param('id') id: string,
    @Body() dto: UpdateLoaiSoLuongDto,
  ) {
    return this.loaiSoLuongService.update(doanhNghiepId, id, dto);
  }

  @Delete(':id')
  remove(@DoanhNghiepId() doanhNghiepId: string, @Param('id') id: string) {
    return this.loaiSoLuongService.remove(doanhNghiepId, id);
  }
}
