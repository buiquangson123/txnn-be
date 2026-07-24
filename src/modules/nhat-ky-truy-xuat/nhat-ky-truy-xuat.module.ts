import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NhatKyTruyXuatController } from './nhat-ky-truy-xuat.controller';
import { NhatKyTruyXuatService } from './nhat-ky-truy-xuat.service';
import {
  NhatKyTruyXuat,
  NhatKyTruyXuatSchema,
} from './schemas/nhat-ky-truy-xuat.schema';
import {
  ThanhVien,
  ThanhVienSchema,
} from '../thanh-vien/schemas/thanh-vien.schema';
import { SanPham, SanPhamSchema } from '../san-pham/schemas/san-pham.schema';
import { LoHang, LoHangSchema } from '../lo-hang/schemas/lo-hang.schema';
import {
  VungSanXuat,
  VungSanXuatSchema,
} from '../vung-san-xuat/schemas/vung-san-xuat.schema';
import {
  NhaXuongKho,
  NhaXuongKhoSchema,
} from '../nha-xuong-kho/schemas/nha-xuong-kho.schema';
import { VatTu, VatTuSchema } from '../vat-tu/schemas/vat-tu.schema';
import {
  DoanhNghiep,
  DoanhNghiepSchema,
} from '../doanh-nghiep/schemas/doanh-nghiep.schema';
import { DoanhNghiepKichHoatGuard } from '../../common/tenant-status/doanh-nghiep-kich-hoat.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NhatKyTruyXuat.name, schema: NhatKyTruyXuatSchema },
      { name: ThanhVien.name, schema: ThanhVienSchema },
      { name: SanPham.name, schema: SanPhamSchema },
      { name: LoHang.name, schema: LoHangSchema },
      { name: VungSanXuat.name, schema: VungSanXuatSchema },
      { name: NhaXuongKho.name, schema: NhaXuongKhoSchema },
      { name: VatTu.name, schema: VatTuSchema },
      { name: DoanhNghiep.name, schema: DoanhNghiepSchema },
    ]),
  ],
  controllers: [NhatKyTruyXuatController],
  providers: [NhatKyTruyXuatService, DoanhNghiepKichHoatGuard],
  exports: [MongooseModule],
})
export class NhatKyTruyXuatModule {}
