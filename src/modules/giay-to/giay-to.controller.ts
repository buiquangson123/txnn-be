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
import { GiayToService } from './giay-to.service';
import { CreateGiayToDto } from './dto/create-giay-to.dto';
import { UpdateGiayToDto } from './dto/update-giay-to.dto';
import { QueryGiayToDto } from './dto/query-giay-to.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { Role } from '../../common/enums/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN_DOANH_NGHIEP, Role.QUAN_LY)
@Controller('giay-to')
export class GiayToController {
  constructor(private readonly giayToService: GiayToService) {}

  @Post()
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreateGiayToDto) {
    return this.giayToService.create(user.doanhNghiepId, dto);
  }

  @Get()
  findAll(@CurrentUser() user: JwtPayload, @Query() query: QueryGiayToDto) {
    return this.giayToService.findAll(user.doanhNghiepId, query);
  }

  @Get(':id')
  findOne(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.giayToService.findOne(user.doanhNghiepId, id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdateGiayToDto,
  ) {
    return this.giayToService.update(user.doanhNghiepId, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.giayToService.remove(user.doanhNghiepId, id);
  }
}
