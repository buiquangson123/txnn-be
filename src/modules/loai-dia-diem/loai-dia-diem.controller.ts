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
import { LoaiDiaDiemService } from './loai-dia-diem.service';
import { CreateLoaiDiaDiemDto } from './dto/create-loai-dia-diem.dto';
import { UpdateLoaiDiaDiemDto } from './dto/update-loai-dia-diem.dto';
import { QueryLoaiDiaDiemDto } from './dto/query-loai-dia-diem.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

/** Danh mục dùng chung toàn hệ thống: mọi tài khoản đã đăng nhập đều đọc được, chỉ System Admin được sửa. */
@UseGuards(JwtAuthGuard)
@Controller('loai-dia-diem')
export class LoaiDiaDiemController {
  constructor(private readonly loaiDiaDiemService: LoaiDiaDiemService) {}

  @UseGuards(RolesGuard)
  @Roles(Role.SYSTEM_ADMIN)
  @Post()
  create(@Body() dto: CreateLoaiDiaDiemDto) {
    return this.loaiDiaDiemService.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryLoaiDiaDiemDto) {
    return this.loaiDiaDiemService.findAll(query);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.SYSTEM_ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateLoaiDiaDiemDto) {
    return this.loaiDiaDiemService.update(id, dto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.SYSTEM_ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.loaiDiaDiemService.remove(id);
  }
}
