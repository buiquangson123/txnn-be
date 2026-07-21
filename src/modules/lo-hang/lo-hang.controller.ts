import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LoHangService } from './lo-hang.service';
import { CreateLoHangDto } from './dto/create-lo-hang.dto';
import { UpdateLoHangDto } from './dto/update-lo-hang.dto';
import { QueryLoHangDto } from './dto/query-lo-hang.dto';
import { CapNhatN1Dto } from './dto/cap-nhat-n1.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { Role } from '../../common/enums/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN_DOANH_NGHIEP, Role.QUAN_LY)
@Controller('lo-hang')
export class LoHangController {
  constructor(private readonly loHangService: LoHangService) {}

  @Post()
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreateLoHangDto) {
    return this.loHangService.create(user.doanhNghiepId, dto);
  }

  @Get()
  findAll(@CurrentUser() user: JwtPayload, @Query() query: QueryLoHangDto) {
    return this.loHangService.findAll(user.doanhNghiepId, query);
  }

  @Get(':id')
  findOne(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.loHangService.findOne(user.doanhNghiepId, id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdateLoHangDto,
  ) {
    return this.loHangService.update(user.doanhNghiepId, id, dto);
  }

  @Patch(':id/n1')
  capNhatN1(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: CapNhatN1Dto,
  ) {
    return this.loHangService.capNhatN1(user.doanhNghiepId, id, dto.n1);
  }
}
