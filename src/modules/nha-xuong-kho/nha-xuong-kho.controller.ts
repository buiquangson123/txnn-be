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
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { Role } from '../../common/enums/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN_DOANH_NGHIEP, Role.QUAN_LY)
@Controller('nha-xuong-kho')
export class NhaXuongKhoController {
  constructor(private readonly nhaXuongKhoService: NhaXuongKhoService) {}

  @Post()
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreateNhaXuongKhoDto) {
    return this.nhaXuongKhoService.create(user.doanhNghiepId, dto);
  }

  @Get()
  findAll(@CurrentUser() user: JwtPayload, @Query() query: QueryNhaXuongKhoDto) {
    return this.nhaXuongKhoService.findAll(user.doanhNghiepId, query);
  }

  @Get(':id')
  findOne(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.nhaXuongKhoService.findOne(user.doanhNghiepId, id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdateNhaXuongKhoDto,
  ) {
    return this.nhaXuongKhoService.update(user.doanhNghiepId, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.nhaXuongKhoService.remove(user.doanhNghiepId, id);
  }
}
