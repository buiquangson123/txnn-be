import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { DonViTrucThuocService } from './don-vi-truc-thuoc.service';
import { CreateDonViTrucThuocDto } from './dto/create-don-vi-truc-thuoc.dto';
import { UpdateDonViTrucThuocDto } from './dto/update-don-vi-truc-thuoc.dto';
import { QueryDonViTrucThuocDto } from './dto/query-don-vi-truc-thuoc.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { Role } from '../../common/enums/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN_DOANH_NGHIEP, Role.QUAN_LY)
@Controller('don-vi-truc-thuoc')
export class DonViTrucThuocController {
  constructor(private readonly donViTrucThuocService: DonViTrucThuocService) {}

  @Post()
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreateDonViTrucThuocDto) {
    return this.donViTrucThuocService.create(user.doanhNghiepId, dto);
  }

  @Get()
  findAll(@CurrentUser() user: JwtPayload, @Query() query: QueryDonViTrucThuocDto) {
    return this.donViTrucThuocService.findAll(user.doanhNghiepId, query);
  }

  @Get(':id')
  findOne(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.donViTrucThuocService.findOne(user.doanhNghiepId, id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdateDonViTrucThuocDto,
  ) {
    return this.donViTrucThuocService.update(user.doanhNghiepId, id, dto);
  }

  @Patch(':id/ngung-lien-ket')
  ngungLienKet(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.donViTrucThuocService.ngungLienKet(user.doanhNghiepId, id);
  }

  @Patch(':id/khoi-phuc')
  khoiPhuc(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.donViTrucThuocService.khoiPhucLienKet(user.doanhNghiepId, id);
  }
}
