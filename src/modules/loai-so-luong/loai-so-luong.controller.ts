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
import { LoaiSoLuongService } from './loai-so-luong.service';
import { CreateLoaiSoLuongDto } from './dto/create-loai-so-luong.dto';
import { UpdateLoaiSoLuongDto } from './dto/update-loai-so-luong.dto';
import { QueryLoaiSoLuongDto } from './dto/query-loai-so-luong.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { Role } from '../../common/enums/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN_DOANH_NGHIEP, Role.QUAN_LY)
@Controller('loai-so-luong')
export class LoaiSoLuongController {
  constructor(private readonly loaiSoLuongService: LoaiSoLuongService) {}

  @Post()
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreateLoaiSoLuongDto) {
    return this.loaiSoLuongService.create(user.doanhNghiepId, dto);
  }

  @Get()
  findAll(@CurrentUser() user: JwtPayload, @Query() query: QueryLoaiSoLuongDto) {
    return this.loaiSoLuongService.findAll(user.doanhNghiepId, query);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdateLoaiSoLuongDto,
  ) {
    return this.loaiSoLuongService.update(user.doanhNghiepId, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.loaiSoLuongService.remove(user.doanhNghiepId, id);
  }
}
