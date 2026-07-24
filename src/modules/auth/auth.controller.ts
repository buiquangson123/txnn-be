import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { JwtPayload } from './jwt-payload.interface';
import { DangKyDoanhNghiepDto } from '../doanh-nghiep/dto/dang-ky-doanh-nghiep.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.soDienThoai, dto.matKhau);
  }

  /** Freemium - đăng ký tự do bằng SĐT (new-requirement.md giai đoạn 1) */
  @Post('dang-ky')
  dangKy(@Body() dto: DangKyDoanhNghiepDto) {
    return this.authService.dangKy(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentUser() user: JwtPayload) {
    return user;
  }
}
