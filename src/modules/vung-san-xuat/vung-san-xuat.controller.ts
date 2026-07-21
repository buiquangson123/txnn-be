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
import { VungSanXuatService } from './vung-san-xuat.service';
import { CreateVungSanXuatDto } from './dto/create-vung-san-xuat.dto';
import { UpdateVungSanXuatDto } from './dto/update-vung-san-xuat.dto';
import { QueryVungSanXuatDto } from './dto/query-vung-san-xuat.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { Role } from '../../common/enums/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN_DOANH_NGHIEP, Role.QUAN_LY)
@Controller('vung-san-xuat')
export class VungSanXuatController {
  constructor(private readonly vungSanXuatService: VungSanXuatService) {}

  @Post()
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreateVungSanXuatDto) {
    return this.vungSanXuatService.create(user.doanhNghiepId, dto);
  }

  @Get()
  findAll(@CurrentUser() user: JwtPayload, @Query() query: QueryVungSanXuatDto) {
    return this.vungSanXuatService.findAll(user.doanhNghiepId, query);
  }

  @Get(':id')
  findOne(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.vungSanXuatService.findOne(user.doanhNghiepId, id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdateVungSanXuatDto,
  ) {
    return this.vungSanXuatService.update(user.doanhNghiepId, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.vungSanXuatService.remove(user.doanhNghiepId, id);
  }
}
