import {
  Body,
  Controller,
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
import { DoanhNghiepId } from '../auth/decorators/doanh-nghiep-id.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/jwt-payload.interface';
import { Role } from '../../common/enums/role.enum';
import { DoanhNghiepKichHoatGuard } from '../../common/tenant-status/doanh-nghiep-kich-hoat.guard';

@UseGuards(JwtAuthGuard, RolesGuard, DoanhNghiepKichHoatGuard)
@Roles(Role.SYSTEM_ADMIN, Role.ADMIN_DOANH_NGHIEP, Role.QUAN_LY)
@Controller('san-pham')
export class SanPhamController {
  constructor(private readonly sanPhamService: SanPhamService) {}

  @Post()
  create(
    @DoanhNghiepId() doanhNghiepId: string,
    @Body() dto: CreateSanPhamDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.sanPhamService.create(doanhNghiepId, dto, user.sub);
  }

  @Get()
  findAll(
    @DoanhNghiepId() doanhNghiepId: string,
    @Query() query: QuerySanPhamDto,
  ) {
    return this.sanPhamService.findAll(doanhNghiepId, query);
  }

  @Get(':id')
  findOne(@DoanhNghiepId() doanhNghiepId: string, @Param('id') id: string) {
    return this.sanPhamService.findOne(doanhNghiepId, id);
  }

  @Patch(':id')
  update(
    @DoanhNghiepId() doanhNghiepId: string,
    @Param('id') id: string,
    @Body() dto: UpdateSanPhamDto,
  ) {
    return this.sanPhamService.update(doanhNghiepId, id, dto);
  }

  @Patch(':id/ngung-kinh-doanh')
  ngungKinhDoanh(
    @DoanhNghiepId() doanhNghiepId: string,
    @Param('id') id: string,
  ) {
    return this.sanPhamService.ngungKinhDoanh(doanhNghiepId, id);
  }

  @Patch(':id/mo-ban-lai')
  moBanLai(@DoanhNghiepId() doanhNghiepId: string, @Param('id') id: string) {
    return this.sanPhamService.moBanLai(doanhNghiepId, id);
  }

  @Get(':id/qr-code')
  async taiMaQR(
    @DoanhNghiepId() doanhNghiepId: string,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const { buffer, tenSanPham } = await this.sanPhamService.sinhMaQR(
      doanhNghiepId,
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
