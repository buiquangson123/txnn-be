import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SanPhamController } from './san-pham.controller';
import { SanPhamService } from './san-pham.service';
import { SanPham, SanPhamSchema } from './schemas/san-pham.schema';
import {
  DoanhNghiep,
  DoanhNghiepSchema,
} from '../doanh-nghiep/schemas/doanh-nghiep.schema';
import {
  DonViTrucThuoc,
  DonViTrucThuocSchema,
} from '../don-vi-truc-thuoc/schemas/don-vi-truc-thuoc.schema';
import {
  VungSanXuat,
  VungSanXuatSchema,
} from '../vung-san-xuat/schemas/vung-san-xuat.schema';
import {
  NhaXuongKho,
  NhaXuongKhoSchema,
} from '../nha-xuong-kho/schemas/nha-xuong-kho.schema';
import {
  ThanhVien,
  ThanhVienSchema,
} from '../thanh-vien/schemas/thanh-vien.schema';
import { DoanhNghiepKichHoatGuard } from '../../common/tenant-status/doanh-nghiep-kich-hoat.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SanPham.name, schema: SanPhamSchema },
      { name: DoanhNghiep.name, schema: DoanhNghiepSchema },
      { name: DonViTrucThuoc.name, schema: DonViTrucThuocSchema },
      { name: VungSanXuat.name, schema: VungSanXuatSchema },
      { name: NhaXuongKho.name, schema: NhaXuongKhoSchema },
      { name: ThanhVien.name, schema: ThanhVienSchema },
    ]),
  ],
  controllers: [SanPhamController],
  providers: [SanPhamService, DoanhNghiepKichHoatGuard],
  exports: [MongooseModule],
})
export class SanPhamModule {}
