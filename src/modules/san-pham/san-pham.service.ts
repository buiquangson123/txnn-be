import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import * as QRCode from 'qrcode';
import { CodeGeneratorService } from '../../common/code-generator/code-generator.service';
import { CounterService } from '../../common/counter/counter.service';
import {
  DoanhNghiep,
  DoanhNghiepDocument,
} from '../doanh-nghiep/schemas/doanh-nghiep.schema';
import {
  DonViTrucThuoc,
  DonViTrucThuocDocument,
} from '../don-vi-truc-thuoc/schemas/don-vi-truc-thuoc.schema';
import {
  VungSanXuat,
  VungSanXuatDocument,
} from '../vung-san-xuat/schemas/vung-san-xuat.schema';
import {
  NhaXuongKho,
  NhaXuongKhoDocument,
} from '../nha-xuong-kho/schemas/nha-xuong-kho.schema';
import {
  ThanhVien,
  ThanhVienDocument,
} from '../thanh-vien/schemas/thanh-vien.schema';
import { CreateSanPhamDto } from './dto/create-san-pham.dto';
import { UpdateSanPhamDto } from './dto/update-san-pham.dto';
import { QuerySanPhamDto } from './dto/query-san-pham.dto';
import {
  SanPham,
  SanPhamDocument,
  TrangThaiSanPham,
} from './schemas/san-pham.schema';

const N1_KHOI_TAO = 0;

@Injectable()
export class SanPhamService {
  constructor(
    @InjectModel(SanPham.name)
    private readonly sanPhamModel: Model<SanPhamDocument>,
    @InjectModel(DoanhNghiep.name)
    private readonly doanhNghiepModel: Model<DoanhNghiepDocument>,
    @InjectModel(DonViTrucThuoc.name)
    private readonly donViTrucThuocModel: Model<DonViTrucThuocDocument>,
    @InjectModel(VungSanXuat.name)
    private readonly vungSanXuatModel: Model<VungSanXuatDocument>,
    @InjectModel(NhaXuongKho.name)
    private readonly nhaXuongKhoModel: Model<NhaXuongKhoDocument>,
    @InjectModel(ThanhVien.name)
    private readonly thanhVienModel: Model<ThanhVienDocument>,
    private readonly codeGeneratorService: CodeGeneratorService,
    private readonly counterService: CounterService,
    private readonly configService: ConfigService,
  ) {}

  private async kiemTraThamChieu(
    doanhNghiepId: string,
    dto: Partial<CreateSanPhamDto>,
  ) {
    if (dto.donViSanXuatId) {
      const ok = await this.donViTrucThuocModel
        .exists({ _id: dto.donViSanXuatId, doanhNghiep: doanhNghiepId })
        .exec();
      if (!ok) throw new BadRequestException('Đơn vị sản xuất không hợp lệ');
    }
    if (dto.donViPhanPhoiIds?.length) {
      const soLuong = await this.donViTrucThuocModel
        .countDocuments({
          _id: { $in: dto.donViPhanPhoiIds },
          doanhNghiep: doanhNghiepId,
        })
        .exec();
      if (soLuong !== dto.donViPhanPhoiIds.length) {
        throw new BadRequestException('Đơn vị phân phối không hợp lệ');
      }
    }
    if (dto.vungSanXuatId) {
      const ok = await this.vungSanXuatModel
        .exists({ _id: dto.vungSanXuatId, doanhNghiep: doanhNghiepId })
        .exec();
      if (!ok) throw new BadRequestException('Vùng sản xuất không hợp lệ');
    }
    if (dto.nhaXuongKhoId) {
      const ok = await this.nhaXuongKhoModel
        .exists({ _id: dto.nhaXuongKhoId, doanhNghiep: doanhNghiepId })
        .exec();
      if (!ok) throw new BadRequestException('Nhà xưởng/kho không hợp lệ');
    }
    if (dto.nguoiQuanLyId) {
      const ok = await this.thanhVienModel
        .exists({ _id: dto.nguoiQuanLyId, doanhNghiep: doanhNghiepId })
        .exec();
      if (!ok)
        throw new BadRequestException('Người quản lý sản phẩm không hợp lệ');
    }
  }

  private mapThamChieu(
    dto: Partial<CreateSanPhamDto>,
  ): Record<string, unknown> {
    const {
      donViSanXuatId,
      donViPhanPhoiIds,
      vungSanXuatId,
      nhaXuongKhoId,
      nguoiQuanLyId,
      ...rest
    } = dto;
    const mapped: Record<string, unknown> = { ...rest };
    if (donViSanXuatId !== undefined) mapped.donViSanXuat = donViSanXuatId;
    if (donViPhanPhoiIds !== undefined) mapped.donViPhanPhoi = donViPhanPhoiIds;
    if (vungSanXuatId !== undefined) mapped.vungSanXuat = vungSanXuatId;
    if (nhaXuongKhoId !== undefined) mapped.nhaXuongKho = nhaXuongKhoId;
    if (nguoiQuanLyId !== undefined) mapped.nguoiQuanLy = nguoiQuanLyId;
    return mapped;
  }

  async create(
    doanhNghiepId: string,
    dto: CreateSanPhamDto,
    nguoiTaoId: string,
  ) {
    await this.kiemTraThamChieu(doanhNghiepId, dto);

    let maGTIN = dto.maGTIN;
    if (maGTIN) {
      if (maGTIN.length !== 13 || !/^\d+$/.test(maGTIN)) {
        throw new BadRequestException('Mã GTIN phải gồm đúng 13 chữ số');
      }
      const trung = await this.sanPhamModel.findOne({ maGTIN }).exec();
      if (trung) {
        throw new BadRequestException('Mã GTIN đã tồn tại, vui lòng nhập lại');
      }
    } else {
      const doanhNghiep = await this.doanhNghiepModel
        .findById(doanhNghiepId)
        .exec();
      if (!doanhNghiep) {
        throw new BadRequestException('Doanh nghiệp không tồn tại');
      }
      const seq = await this.counterService.getNextSequence(
        `ma_vat_pham:${doanhNghiepId}`,
      );
      maGTIN = this.codeGeneratorService.generateGtinOrGlnNoiBo(
        doanhNghiep.maDoanhNghiep,
        String(seq).padStart(4, '0'),
      );
    }

    const maTruyVetVatPham = this.codeGeneratorService.generateMaTruyVetVatPham(
      maGTIN,
      N1_KHOI_TAO,
    );

    return this.sanPhamModel.create({
      ...this.mapThamChieu(dto),
      doanhNghiep: doanhNghiepId,
      hinhAnh: dto.hinhAnh ?? [],
      maGTIN,
      maTruyVetVatPham,
      giayChungNhan: dto.giayChungNhan ?? [],
      kenhBanHang: dto.kenhBanHang ?? [],
      nguoiTao: nguoiTaoId,
      trangThai: TrangThaiSanPham.DANG_BAN,
    });
  }

  findAll(doanhNghiepId: string, query: QuerySanPhamDto) {
    const filter: Record<string, unknown> = { doanhNghiep: doanhNghiepId };
    if (query.nhomSanPham) filter.nhomSanPham = query.nhomSanPham;
    if (query.trangThai) filter.trangThai = query.trangThai;
    if (query.keyword) {
      filter.$or = [
        { tenSanPham: { $regex: query.keyword, $options: 'i' } },
        { maGTIN: { $regex: query.keyword, $options: 'i' } },
        { maTruyVetVatPham: { $regex: query.keyword, $options: 'i' } },
      ];
    }
    return this.sanPhamModel
      .find(filter)
      .populate(
        'donViSanXuat donViPhanPhoi vungSanXuat nhaXuongKho nguoiQuanLy nguoiTao giayChungNhan',
      )
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(doanhNghiepId: string, id: string) {
    const sanPham = await this.sanPhamModel
      .findOne({ _id: id, doanhNghiep: doanhNghiepId })
      .populate(
        'donViSanXuat donViPhanPhoi vungSanXuat nhaXuongKho nguoiQuanLy nguoiTao giayChungNhan',
      )
      .exec();
    if (!sanPham) {
      throw new NotFoundException('Không tìm thấy sản phẩm');
    }
    return sanPham;
  }

  async update(doanhNghiepId: string, id: string, dto: UpdateSanPhamDto) {
    await this.kiemTraThamChieu(doanhNghiepId, dto);
    const sanPham = await this.sanPhamModel
      .findOneAndUpdate(
        { _id: id, doanhNghiep: doanhNghiepId },
        this.mapThamChieu(dto),
        { new: true },
      )
      .populate(
        'donViSanXuat donViPhanPhoi vungSanXuat nhaXuongKho nguoiQuanLy nguoiTao giayChungNhan',
      )
      .exec();
    if (!sanPham) {
      throw new NotFoundException('Không tìm thấy sản phẩm');
    }
    return sanPham;
  }

  private async doiTrangThai(
    doanhNghiepId: string,
    id: string,
    trangThai: TrangThaiSanPham,
  ) {
    const sanPham = await this.sanPhamModel
      .findOneAndUpdate(
        { _id: id, doanhNghiep: doanhNghiepId },
        { trangThai },
        { new: true },
      )
      .exec();
    if (!sanPham) {
      throw new NotFoundException('Không tìm thấy sản phẩm');
    }
    return sanPham;
  }

  ngungKinhDoanh(doanhNghiepId: string, id: string) {
    return this.doiTrangThai(
      doanhNghiepId,
      id,
      TrangThaiSanPham.NGUNG_KINH_DOANH,
    );
  }

  moBanLai(doanhNghiepId: string, id: string) {
    return this.doiTrangThai(doanhNghiepId, id, TrangThaiSanPham.DANG_BAN);
  }

  /** Sinh ảnh QR (PNG buffer) trỏ tới trang truy xuất công khai của sản phẩm. */
  async sinhMaQR(
    doanhNghiepId: string,
    id: string,
  ): Promise<{ buffer: Buffer; tenSanPham: string }> {
    const sanPham = await this.sanPhamModel
      .findOne({ _id: id, doanhNghiep: doanhNghiepId })
      .exec();
    if (!sanPham) {
      throw new NotFoundException('Không tìm thấy sản phẩm');
    }
    // Domain public tạm thời - trang truy xuất công khai chưa được xây dựng, xem CLAUDE.md.
    const baseUrl = this.configService.get<string>(
      'PUBLIC_TRACE_BASE_URL',
      'https://trace.example.com/san-pham',
    );
    const noiDung = `${baseUrl}/${sanPham.maTruyVetVatPham}`;
    const buffer = await QRCode.toBuffer(noiDung, { type: 'png', width: 400 });
    return { buffer, tenSanPham: sanPham.tenSanPham };
  }
}
