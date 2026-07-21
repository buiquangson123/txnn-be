import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LoHangController } from './lo-hang.controller';
import { LoHangService } from './lo-hang.service';
import { LoHang, LoHangSchema } from './schemas/lo-hang.schema';
import { LoaiLoHang, LoaiLoHangSchema } from '../loai-lo-hang/schemas/loai-lo-hang.schema';
import { SanPham, SanPhamSchema } from '../san-pham/schemas/san-pham.schema';
import { VatTu, VatTuSchema } from '../vat-tu/schemas/vat-tu.schema';
import { VungSanXuat, VungSanXuatSchema } from '../vung-san-xuat/schemas/vung-san-xuat.schema';
import { NhaXuongKho, NhaXuongKhoSchema } from '../nha-xuong-kho/schemas/nha-xuong-kho.schema';
import {
  DonViTrucThuoc,
  DonViTrucThuocSchema,
} from '../don-vi-truc-thuoc/schemas/don-vi-truc-thuoc.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LoHang.name, schema: LoHangSchema },
      { name: LoaiLoHang.name, schema: LoaiLoHangSchema },
      { name: SanPham.name, schema: SanPhamSchema },
      { name: VatTu.name, schema: VatTuSchema },
      { name: VungSanXuat.name, schema: VungSanXuatSchema },
      { name: NhaXuongKho.name, schema: NhaXuongKhoSchema },
      { name: DonViTrucThuoc.name, schema: DonViTrucThuocSchema },
    ]),
  ],
  controllers: [LoHangController],
  providers: [LoHangService],
  exports: [MongooseModule],
})
export class LoHangModule {}
