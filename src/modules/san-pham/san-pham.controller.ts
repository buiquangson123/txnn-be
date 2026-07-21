import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { SanPhamService } from './san-pham.service';
import { CreateSanPhamDto } from './dto/create-san-pham.dto';
import { UpdateSanPhamDto } from './dto/update-san-pham.dto';
import { QuerySanPhamDto } from './dto/query-san-pham.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { Role } from '../../common/enums/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN_DOANH_NGHIEP, Role.QUAN_LY)
@Controller('san-pham')
export class SanPhamController {
  constructor(private readonly sanPhamService: SanPhamService) {}

  @Post()
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreateSanPhamDto) {
    return this.sanPhamService.create(user.doanhNghiepId, dto);
  }

  @Get()
  findAll(@CurrentUser() user: JwtPayload, @Query() query: QuerySanPhamDto) {
    return this.sanPhamService.findAll(user.doanhNghiepId, query);
  }

  @Get(':id')
  findOne(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.sanPhamService.findOne(user.doanhNghiepId, id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdateSanPhamDto,
  ) {
    return this.sanPhamService.update(user.doanhNghiepId, id, dto);
  }

  @Patch(':id/ngung-kinh-doanh')
  ngungKinhDoanh(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.sanPhamService.ngungKinhDoanh(user.doanhNghiepId, id);
  }

  @Patch(':id/mo-ban-lai')
  moBanLai(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.sanPhamService.moBanLai(user.doanhNghiepId, id);
  }

  @Get(':id/qr-code')
  async taiMaQR(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const { buffer, tenSanPham } = await this.sanPhamService.sinhMaQR(
      user.doanhNghiepId,
      id,
    );
    const tenFile = `${tenSanPham.replace(/[^\p{L}\p{N}_-]+/gu, '_')}.png`;
    res.set({
      'Content-Type': 'image/png',
      'Content-Disposition': `attachment; filename="${tenFile}"`,
    });
    res.send(buffer);
  }
}
