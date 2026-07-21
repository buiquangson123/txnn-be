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
import { GoiDichVuService } from './goi-dich-vu.service';
import { CreateGoiDichVuDto } from './dto/create-goi-dich-vu.dto';
import { UpdateGoiDichVuDto } from './dto/update-goi-dich-vu.dto';
import { QueryGoiDichVuDto } from './dto/query-goi-dich-vu.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SYSTEM_ADMIN)
@Controller('goi-dich-vu')
export class GoiDichVuController {
  constructor(private readonly goiDichVuService: GoiDichVuService) {}

  @Post()
  create(@Body() dto: CreateGoiDichVuDto) {
    return this.goiDichVuService.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryGoiDichVuDto) {
    return this.goiDichVuService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.goiDichVuService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateGoiDichVuDto) {
    return this.goiDichVuService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.goiDichVuService.remove(id);
  }
}
