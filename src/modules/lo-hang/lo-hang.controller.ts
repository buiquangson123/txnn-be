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
import { LoHangService } from './lo-hang.service';
import { CreateLoHangDto } from './dto/create-lo-hang.dto';
import { UpdateLoHangDto } from './dto/update-lo-hang.dto';
import { QueryLoHangDto } from './dto/query-lo-hang.dto';
import { CapNhatN1Dto } from './dto/cap-nhat-n1.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { DoanhNghiepId } from '../auth/decorators/doanh-nghiep-id.decorator';
import { Role } from '../../common/enums/role.enum';
import { DoanhNghiepKichHoatGuard } from '../../common/tenant-status/doanh-nghiep-kich-hoat.guard';

@UseGuards(JwtAuthGuard, RolesGuard, DoanhNghiepKichHoatGuard)
@Roles(Role.SYSTEM_ADMIN, Role.ADMIN_DOANH_NGHIEP, Role.QUAN_LY)
@Controller('lo-hang')
export class LoHangController {
  constructor(private readonly loHangService: LoHangService) {}

  @Post()
  create(@DoanhNghiepId() doanhNghiepId: string, @Body() dto: CreateLoHangDto) {
    return this.loHangService.create(doanhNghiepId, dto);
  }

  @Get()
  findAll(
    @DoanhNghiepId() doanhNghiepId: string,
    @Query() query: QueryLoHangDto,
  ) {
    return this.loHangService.findAll(doanhNghiepId, query);
  }

  @Get(':id')
  findOne(@DoanhNghiepId() doanhNghiepId: string, @Param('id') id: string) {
    return this.loHangService.findOne(doanhNghiepId, id);
  }

  @Patch(':id')
  update(
    @DoanhNghiepId() doanhNghiepId: string,
    @Param('id') id: string,
    @Body() dto: UpdateLoHangDto,
  ) {
    return this.loHangService.update(doanhNghiepId, id, dto);
  }

  @Patch(':id/n1')
  capNhatN1(
    @DoanhNghiepId() doanhNghiepId: string,
    @Param('id') id: string,
    @Body() dto: CapNhatN1Dto,
  ) {
    return this.loHangService.capNhatN1(doanhNghiepId, id, dto.n1);
  }

  @Get(':id/qr-code')
  async taiMaQR(
    @DoanhNghiepId() doanhNghiepId: string,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const { buffer, tenLoHang } = await this.loHangService.sinhMaQR(
      doanhNghiepId,
      id,
    );
    const tenFile = `${tenLoHang.replace(/[^\p{L}\p{N}_-]+/gu, '_')}.png`;
    res.set({
      'Content-Type': 'image/png',
      'Content-Disposition': `attachment; filename="${tenFile}"`,
    });
    res.send(buffer);
  }
}
