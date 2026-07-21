import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ThanhVienService } from '../modules/thanh-vien/thanh-vien.service';

async function bootstrap() {
  const [soDienThoai, matKhau, hoTen] = process.argv.slice(2);
  if (!soDienThoai || !matKhau) {
    console.error('Cách dùng: npm run seed:admin -- <soDienThoai> <matKhau> [hoTen]');
    process.exit(1);
  }

  const app = await NestFactory.createApplicationContext(AppModule);
  const thanhVienService = app.get(ThanhVienService);

  const admin = await thanhVienService.taoSystemAdmin(
    soDienThoai,
    matKhau,
    hoTen ?? 'System Admin',
  );

  console.log('Đã tạo System Admin:', {
    id: admin._id,
    soDienThoai: admin.soDienThoai,
  });

  await app.close();
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
