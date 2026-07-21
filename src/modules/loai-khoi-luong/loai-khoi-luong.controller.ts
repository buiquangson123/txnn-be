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
import { LoaiKhoiLuongService } from './loai-khoi-luong.service';
import { CreateLoaiKhoiLuongDto } from './dto/create-loai-khoi-luong.dto';
import { UpdateLoaiKhoiLuongDto } from './dto/update-loai-khoi-luong.dto';
import { QueryLoaiKhoiLuongDto } from './dto/query-loai-khoi-luong.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { Role } from '../../common/enums/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN_DOANH_NGHIEP, Role.QUAN_LY)
@Controller('loai-khoi-luong')
export class LoaiKhoiLuongController {
  constructor(private readonly loaiKhoiLuongService: LoaiKhoiLuongService) {}

  @Post()
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreateLoaiKhoiLuongDto) {
    return this.loaiKhoiLuongService.create(user.doanhNghiepId, dto);
  }

  @Get()
  findAll(@CurrentUser() user: JwtPayload, @Query() query: QueryLoaiKhoiLuongDto) {
    return this.loaiKhoiLuongService.findAll(user.doanhNghiepId, query);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdateLoaiKhoiLuongDto,
  ) {
    return this.loaiKhoiLuongService.update(user.doanhNghiepId, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.loaiKhoiLuongService.remove(user.doanhNghiepId, id);
  }
}
