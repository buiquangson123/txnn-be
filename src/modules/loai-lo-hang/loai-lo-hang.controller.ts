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
import { LoaiLoHangService } from './loai-lo-hang.service';
import { CreateLoaiLoHangDto } from './dto/create-loai-lo-hang.dto';
import { UpdateLoaiLoHangDto } from './dto/update-loai-lo-hang.dto';
import { QueryLoaiLoHangDto } from './dto/query-loai-lo-hang.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { Role } from '../../common/enums/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN_DOANH_NGHIEP, Role.QUAN_LY)
@Controller('loai-lo-hang')
export class LoaiLoHangController {
  constructor(private readonly loaiLoHangService: LoaiLoHangService) {}

  @Post()
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreateLoaiLoHangDto) {
    return this.loaiLoHangService.create(user.doanhNghiepId, dto);
  }

  @Get()
  findAll(@CurrentUser() user: JwtPayload, @Query() query: QueryLoaiLoHangDto) {
    return this.loaiLoHangService.findAll(user.doanhNghiepId, query);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdateLoaiLoHangDto,
  ) {
    return this.loaiLoHangService.update(user.doanhNghiepId, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.loaiLoHangService.remove(user.doanhNghiepId, id);
  }
}
