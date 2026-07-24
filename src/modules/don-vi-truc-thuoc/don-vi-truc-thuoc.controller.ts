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
import { DonViTrucThuocService } from './don-vi-truc-thuoc.service';
import { CreateDonViTrucThuocDto } from './dto/create-don-vi-truc-thuoc.dto';
import { UpdateDonViTrucThuocDto } from './dto/update-don-vi-truc-thuoc.dto';
import { QueryDonViTrucThuocDto } from './dto/query-don-vi-truc-thuoc.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { DoanhNghiepId } from '../auth/decorators/doanh-nghiep-id.decorator';
import { Role } from '../../common/enums/role.enum';
import { DoanhNghiepKichHoatGuard } from '../../common/tenant-status/doanh-nghiep-kich-hoat.guard';

@UseGuards(JwtAuthGuard, RolesGuard, DoanhNghiepKichHoatGuard)
@Roles(Role.SYSTEM_ADMIN, Role.ADMIN_DOANH_NGHIEP, Role.QUAN_LY)
@Controller('don-vi-truc-thuoc')
export class DonViTrucThuocController {
  constructor(private readonly donViTrucThuocService: DonViTrucThuocService) {}

  @Post()
  create(
    @DoanhNghiepId() doanhNghiepId: string,
    @Body() dto: CreateDonViTrucThuocDto,
  ) {
    return this.donViTrucThuocService.create(doanhNghiepId, dto);
  }

  @Get()
  findAll(
    @DoanhNghiepId() doanhNghiepId: string,
    @Query() query: QueryDonViTrucThuocDto,
  ) {
    return this.donViTrucThuocService.findAll(doanhNghiepId, query);
  }

  @Get(':id')
  findOne(@DoanhNghiepId() doanhNghiepId: string, @Param('id') id: string) {
    return this.donViTrucThuocService.findOne(doanhNghiepId, id);
  }

  @Patch(':id')
  update(
    @DoanhNghiepId() doanhNghiepId: string,
    @Param('id') id: string,
    @Body() dto: UpdateDonViTrucThuocDto,
  ) {
    return this.donViTrucThuocService.update(doanhNghiepId, id, dto);
  }

  @Patch(':id/ngung-lien-ket')
  ngungLienKet(
    @DoanhNghiepId() doanhNghiepId: string,
    @Param('id') id: string,
  ) {
    return this.donViTrucThuocService.ngungLienKet(doanhNghiepId, id);
  }

  @Patch(':id/khoi-phuc')
  khoiPhuc(@DoanhNghiepId() doanhNghiepId: string, @Param('id') id: string) {
    return this.donViTrucThuocService.khoiPhucLienKet(doanhNghiepId, id);
  }
}
