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
import { VatTuService } from './vat-tu.service';
import { CreateVatTuDto } from './dto/create-vat-tu.dto';
import { UpdateVatTuDto } from './dto/update-vat-tu.dto';
import { QueryVatTuDto } from './dto/query-vat-tu.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { DoanhNghiepId } from '../auth/decorators/doanh-nghiep-id.decorator';
import { Role } from '../../common/enums/role.enum';
import { DoanhNghiepKichHoatGuard } from '../../common/tenant-status/doanh-nghiep-kich-hoat.guard';

@UseGuards(JwtAuthGuard, RolesGuard, DoanhNghiepKichHoatGuard)
@Roles(Role.SYSTEM_ADMIN, Role.ADMIN_DOANH_NGHIEP, Role.QUAN_LY)
@Controller('vat-tu')
export class VatTuController {
  constructor(private readonly vatTuService: VatTuService) {}

  @Post()
  create(@DoanhNghiepId() doanhNghiepId: string, @Body() dto: CreateVatTuDto) {
    return this.vatTuService.create(doanhNghiepId, dto);
  }

  @Get()
  findAll(
    @DoanhNghiepId() doanhNghiepId: string,
    @Query() query: QueryVatTuDto,
  ) {
    return this.vatTuService.findAll(doanhNghiepId, query);
  }

  @Get(':id')
  findOne(@DoanhNghiepId() doanhNghiepId: string, @Param('id') id: string) {
    return this.vatTuService.findOne(doanhNghiepId, id);
  }

  @Patch(':id')
  update(
    @DoanhNghiepId() doanhNghiepId: string,
    @Param('id') id: string,
    @Body() dto: UpdateVatTuDto,
  ) {
    return this.vatTuService.update(doanhNghiepId, id, dto);
  }

  @Delete(':id')
  remove(@DoanhNghiepId() doanhNghiepId: string, @Param('id') id: string) {
    return this.vatTuService.remove(doanhNghiepId, id);
  }
}
