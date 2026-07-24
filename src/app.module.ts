import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CodeGeneratorModule } from './common/code-generator/code-generator.module';
import { TenantStatusModule } from './common/tenant-status/tenant-status.module';
import { GoiDichVuModule } from './modules/goi-dich-vu/goi-dich-vu.module';
import { DoanhNghiepModule } from './modules/doanh-nghiep/doanh-nghiep.module';
import { ThanhVienModule } from './modules/thanh-vien/thanh-vien.module';
import { AuthModule } from './modules/auth/auth.module';
import { DonViTrucThuocModule } from './modules/don-vi-truc-thuoc/don-vi-truc-thuoc.module';
import { LoaiDiaDiemModule } from './modules/loai-dia-diem/loai-dia-diem.module';
import { LoaiKhoiLuongModule } from './modules/loai-khoi-luong/loai-khoi-luong.module';
import { LoaiSoLuongModule } from './modules/loai-so-luong/loai-so-luong.module';
import { LoaiLoHangModule } from './modules/loai-lo-hang/loai-lo-hang.module';
import { VungSanXuatModule } from './modules/vung-san-xuat/vung-san-xuat.module';
import { NhaXuongKhoModule } from './modules/nha-xuong-kho/nha-xuong-kho.module';
import { VatTuModule } from './modules/vat-tu/vat-tu.module';
import { GiayToModule } from './modules/giay-to/giay-to.module';
import { SanPhamModule } from './modules/san-pham/san-pham.module';
import { LoHangModule } from './modules/lo-hang/lo-hang.module';
import { NhatKyTruyXuatModule } from './modules/nhat-ky-truy-xuat/nhat-ky-truy-xuat.module';
import { UploadModule } from './modules/upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI'),
      }),
    }),
    CodeGeneratorModule,
    TenantStatusModule,
    GoiDichVuModule,
    DoanhNghiepModule,
    ThanhVienModule,
    AuthModule,
    DonViTrucThuocModule,
    LoaiDiaDiemModule,
    LoaiKhoiLuongModule,
    LoaiSoLuongModule,
    LoaiLoHangModule,
    VungSanXuatModule,
    NhaXuongKhoModule,
    VatTuModule,
    GiayToModule,
    SanPhamModule,
    LoHangModule,
    NhatKyTruyXuatModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
