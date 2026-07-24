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
import { NhaXuongKhoService } from './nha-xuong-kho.service';
import { CreateNhaXuongKhoDto } from './dto/create-nha-xuong-kho.dto';
import { UpdateNhaXuongKhoDto } from './dto/update-nha-xuong-kho.dto';
import { QueryNhaXuongKhoDto } from './dto/query-nha-xuong-kho.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { DoanhNghiepId } from '../auth/decorators/doanh-nghiep-id.decorator';
import { Role } from '../../common/enums/role.enum';
import { DoanhNghiepKichHoatGuard } from '../../common/tenant-status/doanh-nghiep-kich-hoat.guard';

@UseGuards(JwtAuthGuard, RolesGuard, DoanhNghiepKichHoatGuard)
@Roles(Role.SYSTEM_ADMIN, Role.ADMIN_DOANH_NGHIEP, Role.QUAN_LY)
@Controller('nha-xuong-kho')
export class NhaXuongKhoController {
  constructor(private readonly nhaXuongKhoService: NhaXuongKhoService) {}

  @Post()
  create(
    @DoanhNghiepId() doanhNghiepId: string,
    @Body() dto: CreateNhaXuongKhoDto,
  ) {
    return this.nhaXuongKhoService.create(doanhNghiepId, dto);
  }

  @Get()
  findAll(
    @DoanhNghiepId() doanhNghiepId: string,
    @Query() query: QueryNhaXuongKhoDto,
  ) {
    return this.nhaXuongKhoService.findAll(doanhNghiepId, query);
  }

  @Get(':id')
  findOne(@DoanhNghiepId() doanhNghiepId: string, @Param('id') id: string) {
    return this.nhaXuongKhoService.findOne(doanhNghiepId, id);
  }

  @Patch(':id')
  update(
    @DoanhNghiepId() doanhNghiepId: string,
    @Param('id') id: string,
    @Body() dto: UpdateNhaXuongKhoDto,
  ) {
    return this.nhaXuongKhoService.update(doanhNghiepId, id, dto);
  }

  @Delete(':id')
  remove(@DoanhNghiepId() doanhNghiepId: string, @Param('id') id: string) {
    return this.nhaXuongKhoService.remove(doanhNghiepId, id);
  }
}
