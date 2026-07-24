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
import { LoaiLoHangService } from './loai-lo-hang.service';
import { CreateLoaiLoHangDto } from './dto/create-loai-lo-hang.dto';
import { UpdateLoaiLoHangDto } from './dto/update-loai-lo-hang.dto';
import { QueryLoaiLoHangDto } from './dto/query-loai-lo-hang.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { DoanhNghiepId } from '../auth/decorators/doanh-nghiep-id.decorator';
import { Role } from '../../common/enums/role.enum';
import { DoanhNghiepKichHoatGuard } from '../../common/tenant-status/doanh-nghiep-kich-hoat.guard';

@UseGuards(JwtAuthGuard, RolesGuard, DoanhNghiepKichHoatGuard)
@Roles(Role.SYSTEM_ADMIN, Role.ADMIN_DOANH_NGHIEP, Role.QUAN_LY)
@Controller('loai-lo-hang')
export class LoaiLoHangController {
  constructor(private readonly loaiLoHangService: LoaiLoHangService) {}

  @Post()
  create(
    @DoanhNghiepId() doanhNghiepId: string,
    @Body() dto: CreateLoaiLoHangDto,
  ) {
    return this.loaiLoHangService.create(doanhNghiepId, dto);
  }

  @Get()
  findAll(
    @DoanhNghiepId() doanhNghiepId: string,
    @Query() query: QueryLoaiLoHangDto,
  ) {
    return this.loaiLoHangService.findAll(doanhNghiepId, query);
  }

  @Patch(':id')
  update(
    @DoanhNghiepId() doanhNghiepId: string,
    @Param('id') id: string,
    @Body() dto: UpdateLoaiLoHangDto,
  ) {
    return this.loaiLoHangService.update(doanhNghiepId, id, dto);
  }

  @Delete(':id')
  remove(@DoanhNghiepId() doanhNghiepId: string, @Param('id') id: string) {
    return this.loaiLoHangService.remove(doanhNghiepId, id);
  }
}
