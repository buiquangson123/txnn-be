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
import { VungSanXuatService } from './vung-san-xuat.service';
import { CreateVungSanXuatDto } from './dto/create-vung-san-xuat.dto';
import { UpdateVungSanXuatDto } from './dto/update-vung-san-xuat.dto';
import { QueryVungSanXuatDto } from './dto/query-vung-san-xuat.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { DoanhNghiepId } from '../auth/decorators/doanh-nghiep-id.decorator';
import { Role } from '../../common/enums/role.enum';
import { DoanhNghiepKichHoatGuard } from '../../common/tenant-status/doanh-nghiep-kich-hoat.guard';

@UseGuards(JwtAuthGuard, RolesGuard, DoanhNghiepKichHoatGuard)
@Roles(Role.SYSTEM_ADMIN, Role.ADMIN_DOANH_NGHIEP, Role.QUAN_LY)
@Controller('vung-san-xuat')
export class VungSanXuatController {
  constructor(private readonly vungSanXuatService: VungSanXuatService) {}

  @Post()
  create(
    @DoanhNghiepId() doanhNghiepId: string,
    @Body() dto: CreateVungSanXuatDto,
  ) {
    return this.vungSanXuatService.create(doanhNghiepId, dto);
  }

  @Get()
  findAll(
    @DoanhNghiepId() doanhNghiepId: string,
    @Query() query: QueryVungSanXuatDto,
  ) {
    return this.vungSanXuatService.findAll(doanhNghiepId, query);
  }

  @Get(':id')
  findOne(@DoanhNghiepId() doanhNghiepId: string, @Param('id') id: string) {
    return this.vungSanXuatService.findOne(doanhNghiepId, id);
  }

  @Patch(':id')
  update(
    @DoanhNghiepId() doanhNghiepId: string,
    @Param('id') id: string,
    @Body() dto: UpdateVungSanXuatDto,
  ) {
    return this.vungSanXuatService.update(doanhNghiepId, id, dto);
  }

  @Delete(':id')
  remove(@DoanhNghiepId() doanhNghiepId: string, @Param('id') id: string) {
    return this.vungSanXuatService.remove(doanhNghiepId, id);
  }
}
