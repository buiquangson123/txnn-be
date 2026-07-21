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
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { Role } from '../../common/enums/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN_DOANH_NGHIEP, Role.QUAN_LY)
@Controller('vat-tu')
export class VatTuController {
  constructor(private readonly vatTuService: VatTuService) {}

  @Post()
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreateVatTuDto) {
    return this.vatTuService.create(user.doanhNghiepId, dto);
  }

  @Get()
  findAll(@CurrentUser() user: JwtPayload, @Query() query: QueryVatTuDto) {
    return this.vatTuService.findAll(user.doanhNghiepId, query);
  }

  @Get(':id')
  findOne(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.vatTuService.findOne(user.doanhNghiepId, id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdateVatTuDto,
  ) {
    return this.vatTuService.update(user.doanhNghiepId, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.vatTuService.remove(user.doanhNghiepId, id);
  }
}
