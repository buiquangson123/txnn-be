import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ThanhVien,
  ThanhVienDocument,
} from '../thanh-vien/schemas/thanh-vien.schema';
import { SanPham, SanPhamDocument } from '../san-pham/schemas/san-pham.schema';
import { LoHang, LoHangDocument } from '../lo-hang/schemas/lo-hang.schema';
import {
  VungSanXuat,
  VungSanXuatDocument,
} from '../vung-san-xuat/schemas/vung-san-xuat.schema';
import {
  NhaXuongKho,
  NhaXuongKhoDocument,
} from '../nha-xuong-kho/schemas/nha-xuong-kho.schema';
import { VatTu, VatTuDocument } from '../vat-tu/schemas/vat-tu.schema';
import { CreateNhatKyTruyXuatDto } from './dto/create-nhat-ky-truy-xuat.dto';
import { UpdateNhatKyTruyXuatDto } from './dto/update-nhat-ky-truy-xuat.dto';
import { QueryNhatKyTruyXuatDto } from './dto/query-nhat-ky-truy-xuat.dto';
import {
  DoiTuongNhatKy,
  NhatKyTruyXuat,
  NhatKyTruyXuatDocument,
} from './schemas/nhat-ky-truy-xuat.schema';

const POPULATE_FIELDS = 'nguoiThucHien vungSanXuat nhaXuong vatTu';

@Injectable()
export class NhatKyTruyXuatService {
  constructor(
    @InjectModel(NhatKyTruyXuat.name)
    private readonly nhatKyModel: Model<NhatKyTruyXuatDocument>,
    @InjectModel(ThanhVien.name)
    private readonly thanhVienModel: Model<ThanhVienDocument>,
    @InjectModel(SanPham.name)
    private readonly sanPhamModel: Model<SanPhamDocument>,
    @InjectModel(LoHang.name)
    private readonly loHangModel: Model<LoHangDocument>,
    @InjectModel(VungSanXuat.name)
    private readonly vungSanXuatModel: Model<VungSanXuatDocument>,
    @InjectModel(NhaXuongKho.name)
    private readonly nhaXuongKhoModel: Model<NhaXuongKhoDocument>,
    @InjectModel(VatTu.name)
    private readonly vatTuModel: Model<VatTuDocument>,
  ) {}

  private async validate(
    doanhNghiepId: string,
    dto: CreateNhatKyTruyXuatDto | UpdateNhatKyTruyXuatDto,
  ) {
    if (dto.vungSanXuatId) {
      const vungSanXuat = await this.vungSanXuatModel
        .findOne({ _id: dto.vungSanXuatId, doanhNghiep: doanhNghiepId })
        .exec();
      if (!vungSanXuat) {
        throw new BadRequestException(
          'Vùng sản xuất không tồn tại trong doanh nghiệp',
        );
      }
    }
    if (dto.nhaXuongId) {
      const nhaXuong = await this.nhaXuongKhoModel
        .findOne({ _id: dto.nhaXuongId, doanhNghiep: doanhNghiepId })
        .exec();
      if (!nhaXuong) {
        throw new BadRequestException(
          'Nhà xưởng không tồn tại trong doanh nghiệp',
        );
      }
    }
    if (dto.vatTu?.length) {
      const soLuong = await this.vatTuModel
        .countDocuments({
          _id: { $in: dto.vatTu },
          doanhNghiep: doanhNghiepId,
        })
        .exec();
      if (soLuong !== dto.vatTu.length) {
        throw new BadRequestException(
          'Một hoặc nhiều vật tư không tồn tại trong doanh nghiệp',
        );
      }
    }
  }

  private async validateDoiTuong(
    doanhNghiepId: string,
    doiTuongLienQuan: DoiTuongNhatKy,
    doiTuongId: string,
  ) {
    if (doiTuongLienQuan === DoiTuongNhatKy.SAN_PHAM) {
      const sanPham = await this.sanPhamModel
        .findOne({ _id: doiTuongId, doanhNghiep: doanhNghiepId })
        .exec();
      if (!sanPham) {
        throw new BadRequestException(
          'Sản phẩm không tồn tại trong doanh nghiệp',
        );
      }
    } else {
      const loHang = await this.loHangModel
        .findOne({ _id: doiTuongId, doanhNghiep: doanhNghiepId })
        .exec();
      if (!loHang) {
        throw new BadRequestException(
          'Lô hàng không tồn tại trong doanh nghiệp',
        );
      }
    }
  }

  async create(
    doanhNghiepId: string,
    dto: CreateNhatKyTruyXuatDto,
    nguoiThucHienId: string,
  ) {
    await this.validate(doanhNghiepId, dto);
    await this.validateDoiTuong(
      doanhNghiepId,
      dto.doiTuongLienQuan,
      dto.doiTuongId,
    );

    return this.nhatKyModel.create({
      doanhNghiep: doanhNghiepId,
      thoiGianThucHien: new Date(),
      nguoiThucHien: nguoiThucHienId,
      nganhNghe: dto.nganhNghe,
      nganhNgheKhac: dto.nganhNgheKhac,
      congDoanTen: dto.congDoanTen,
      vatTu: dto.vatTu ?? [],
      noiDungCongViec: dto.noiDungCongViec,
      hinhAnhTaiLieu: dto.hinhAnhTaiLieu,
      ghiChu: dto.ghiChu,
      vungSanXuat: dto.vungSanXuatId,
      nhaXuong: dto.nhaXuongId,
      doiTuongLienQuan: dto.doiTuongLienQuan,
      doiTuongId: dto.doiTuongId,
      hienThiCongKhai: dto.hienThiCongKhai ?? true,
    });
  }

  findAll(doanhNghiepId: string, query: QueryNhatKyTruyXuatDto) {
    const filter: Record<string, unknown> = { doanhNghiep: doanhNghiepId };
    if (query.doiTuongLienQuan)
      filter.doiTuongLienQuan = query.doiTuongLienQuan;
    if (query.doiTuongId) filter.doiTuongId = query.doiTuongId;
    if (query.nguoiThucHienId) filter.nguoiThucHien = query.nguoiThucHienId;
    if (query.tuNgay || query.denNgay) {
      const khoang: Record<string, Date> = {};
      if (query.tuNgay) khoang.$gte = new Date(query.tuNgay);
      if (query.denNgay) khoang.$lte = new Date(query.denNgay);
      filter.thoiGianThucHien = khoang;
    }
    return this.nhatKyModel
      .find(filter)
      .populate(POPULATE_FIELDS)
      .sort({ thoiGianThucHien: -1 })
      .exec();
  }

  async findOne(doanhNghiepId: string, id: string) {
    const nhatKy = await this.nhatKyModel
      .findOne({ _id: id, doanhNghiep: doanhNghiepId })
      .populate(POPULATE_FIELDS)
      .exec();
    if (!nhatKy) {
      throw new NotFoundException('Không tìm thấy nhật ký truy xuất');
    }
    return nhatKy;
  }

  async update(
    doanhNghiepId: string,
    id: string,
    dto: UpdateNhatKyTruyXuatDto,
  ) {
    await this.validate(doanhNghiepId, dto);

    // vungSanXuatId/nhaXuongId là tên field DTO, khác tên ref field trong schema
    // (vungSanXuat/nhaXuong) nên phải map lại tên trước khi update.
    const { vungSanXuatId, nhaXuongId, ...rest } = dto;
    const update: Record<string, unknown> = { ...rest };
    if (vungSanXuatId !== undefined) update.vungSanXuat = vungSanXuatId;
    if (nhaXuongId !== undefined) update.nhaXuong = nhaXuongId;

    const nhatKy = await this.nhatKyModel
      .findOneAndUpdate({ _id: id, doanhNghiep: doanhNghiepId }, update, {
        new: true,
      })
      .populate(POPULATE_FIELDS)
      .exec();
    if (!nhatKy) {
      throw new NotFoundException('Không tìm thấy nhật ký truy xuất');
    }
    return nhatKy;
  }

  async remove(doanhNghiepId: string, id: string) {
    const nhatKy = await this.nhatKyModel
      .findOneAndDelete({ _id: id, doanhNghiep: doanhNghiepId })
      .exec();
    if (!nhatKy) {
      throw new NotFoundException('Không tìm thấy nhật ký truy xuất');
    }
    return { deleted: true };
  }

  /**
   * Dùng cho trang public khi quét QR - chỉ trả về nhật ký được phép hiển thị công khai.
   * Chỉ populate họ tên người thực hiện, không lộ SĐT/thông tin nội bộ khác.
   */
  layNhatKyCongKhai(doiTuongLienQuan: DoiTuongNhatKy, doiTuongId: string) {
    return this.nhatKyModel
      .find({ doiTuongLienQuan, doiTuongId, hienThiCongKhai: true })
      .populate({ path: 'nguoiThucHien', select: 'hoTen' })
      .populate('vungSanXuat nhaXuong vatTu')
      .select('-doanhNghiep')
      .sort({ thoiGianThucHien: 1 })
      .exec();
  }
}
