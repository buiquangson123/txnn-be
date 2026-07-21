import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CodeGeneratorService } from '../../common/code-generator/code-generator.service';
import { CounterService } from '../../common/counter/counter.service';
import { SanPham, SanPhamDocument } from '../san-pham/schemas/san-pham.schema';
import { VatTu, VatTuDocument } from '../vat-tu/schemas/vat-tu.schema';
import {
  LoaiLoHang,
  LoaiLoHangDocument,
  DoiTuongDiaDiemBatBuoc,
} from '../loai-lo-hang/schemas/loai-lo-hang.schema';
import { VungSanXuat, VungSanXuatDocument } from '../vung-san-xuat/schemas/vung-san-xuat.schema';
import { NhaXuongKho, NhaXuongKhoDocument } from '../nha-xuong-kho/schemas/nha-xuong-kho.schema';
import {
  DonViTrucThuoc,
  DonViTrucThuocDocument,
} from '../don-vi-truc-thuoc/schemas/don-vi-truc-thuoc.schema';
import { CreateLoHangDto } from './dto/create-lo-hang.dto';
import { UpdateLoHangDto } from './dto/update-lo-hang.dto';
import { QueryLoHangDto } from './dto/query-lo-hang.dto';
import { DoiTuongLoHang, LoHang, LoHangDocument } from './schemas/lo-hang.schema';

const POPULATE_FIELDS =
  'loaiLoHang sanPham vatTu vungSanXuat nhaXuong donViSanXuat loaiKhoiLuong loaiSoLuong nguyenLieuDauVao';

@Injectable()
export class LoHangService {
  constructor(
    @InjectModel(LoHang.name)
    private readonly loHangModel: Model<LoHangDocument>,
    @InjectModel(LoaiLoHang.name)
    private readonly loaiLoHangModel: Model<LoaiLoHangDocument>,
    @InjectModel(SanPham.name)
    private readonly sanPhamModel: Model<SanPhamDocument>,
    @InjectModel(VatTu.name)
    private readonly vatTuModel: Model<VatTuDocument>,
    @InjectModel(VungSanXuat.name)
    private readonly vungSanXuatModel: Model<VungSanXuatDocument>,
    @InjectModel(NhaXuongKho.name)
    private readonly nhaXuongKhoModel: Model<NhaXuongKhoDocument>,
    @InjectModel(DonViTrucThuoc.name)
    private readonly donViTrucThuocModel: Model<DonViTrucThuocDocument>,
    private readonly codeGeneratorService: CodeGeneratorService,
    private readonly counterService: CounterService,
  ) {}

  private tinhN1(nguyenLieuList: { n1?: number }[]): number {
    if (nguyenLieuList.length === 0) return 0;
    if (nguyenLieuList.length === 1) return 1;
    const maxN1 = Math.max(...nguyenLieuList.map((l) => l.n1 ?? 0));
    return Math.min(maxN1 + 1, 8);
  }

  private dinhDangNgayYYMMDD(): string {
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yy = String(now.getFullYear()).slice(-2);
    return `${dd}${mm}${yy}`;
  }

  async create(doanhNghiepId: string, dto: CreateLoHangDto) {
    const loaiLoHang = await this.loaiLoHangModel
      .findOne({ _id: dto.loaiLoHangId, doanhNghiep: doanhNghiepId })
      .exec();
    if (!loaiLoHang) {
      throw new BadRequestException('Loại lô hàng không tồn tại');
    }

    if (loaiLoHang.doiTuongDiaDiemBatBuoc === DoiTuongDiaDiemBatBuoc.VUNG_SAN_XUAT) {
      if (!dto.vungSanXuatId) {
        throw new BadRequestException(
          `Loại lô hàng "${loaiLoHang.tenLoaiLo}" bắt buộc chọn Vùng sản xuất`,
        );
      }
      const vungSanXuat = await this.vungSanXuatModel
        .findOne({ _id: dto.vungSanXuatId, doanhNghiep: doanhNghiepId })
        .exec();
      if (!vungSanXuat) {
        throw new BadRequestException('Vùng sản xuất không tồn tại trong doanh nghiệp');
      }
    } else {
      if (!dto.nhaXuongId) {
        throw new BadRequestException(
          `Loại lô hàng "${loaiLoHang.tenLoaiLo}" bắt buộc chọn Nhà xưởng sản xuất`,
        );
      }
      const nhaXuong = await this.nhaXuongKhoModel
        .findOne({ _id: dto.nhaXuongId, doanhNghiep: doanhNghiepId })
        .exec();
      if (!nhaXuong) {
        throw new BadRequestException('Nhà xưởng không tồn tại trong doanh nghiệp');
      }
    }

    if (dto.donViSanXuatId) {
      const donVi = await this.donViTrucThuocModel
        .findOne({ _id: dto.donViSanXuatId, doanhNghiep: doanhNghiepId })
        .exec();
      if (!donVi) {
        throw new BadRequestException('Đơn vị sản xuất không tồn tại trong doanh nghiệp');
      }
    }

    let sanPham: SanPhamDocument | null = null;
    if (dto.doiTuong === DoiTuongLoHang.SAN_PHAM) {
      sanPham = await this.sanPhamModel
        .findOne({ _id: dto.sanPhamId, doanhNghiep: doanhNghiepId })
        .exec();
      if (!sanPham) {
        throw new BadRequestException('Sản phẩm không tồn tại trong doanh nghiệp');
      }
    } else {
      const vatTu = await this.vatTuModel
        .findOne({ _id: dto.vatTuId, doanhNghiep: doanhNghiepId })
        .exec();
      if (!vatTu) {
        throw new BadRequestException('Vật tư không tồn tại trong doanh nghiệp');
      }
    }

    let nguyenLieuLoList: LoHangDocument[] = [];
    if (dto.nguyenLieuDauVao && dto.nguyenLieuDauVao.length > 0) {
      nguyenLieuLoList = await this.loHangModel
        .find({ _id: { $in: dto.nguyenLieuDauVao }, doanhNghiep: doanhNghiepId })
        .exec();
      if (nguyenLieuLoList.length !== dto.nguyenLieuDauVao.length) {
        throw new BadRequestException(
          'Một hoặc nhiều lô nguyên liệu đầu vào không tồn tại trong doanh nghiệp',
        );
      }
    }

    const stt = await this.counterService.getNextSequence(
      `so_lo:${doanhNghiepId}:${this.dinhDangNgayYYMMDD()}`,
    );
    const soLo = this.codeGeneratorService.generateSoLo(
      loaiLoHang.vietTat,
      new Date(),
      stt,
    );

    let maTruyVetVatPham: string | undefined;
    let maTruyVetLoHang: string | undefined;
    let n1: number | undefined;
    if (sanPham) {
      n1 = this.tinhN1(nguyenLieuLoList);
      maTruyVetVatPham = this.codeGeneratorService.generateMaTruyVetVatPham(
        sanPham.maGTIN as string,
        n1,
      );
      maTruyVetLoHang = this.codeGeneratorService.generateMaTruyVetLoHang(
        sanPham.maGTIN as string,
        soLo,
      );
    }

    return this.loHangModel.create({
      doanhNghiep: doanhNghiepId,
      soLo,
      maTruyVetLoHang,
      loaiLoHang: dto.loaiLoHangId,
      tenLoHang: dto.tenLoHang,
      doiTuong: dto.doiTuong,
      sanPham: dto.sanPhamId,
      vatTu: dto.vatTuId,
      maTruyVetVatPham,
      n1,
      nguyenLieuDauVao: dto.nguyenLieuDauVao ?? [],
      donViSanXuat: dto.donViSanXuatId,
      khoiLuong: dto.khoiLuong,
      loaiKhoiLuong: dto.loaiKhoiLuongId,
      soLuong: dto.soLuong,
      loaiSoLuong: dto.loaiSoLuongId,
      ngaySanXuat: dto.ngaySanXuat,
      hanSuDung: dto.hanSuDung,
      vungSanXuat: dto.vungSanXuatId,
      nhaXuong: dto.nhaXuongId,
      ghiChu: dto.ghiChu,
    });
  }

  findAll(doanhNghiepId: string, query: QueryLoHangDto) {
    const filter: Record<string, unknown> = { doanhNghiep: doanhNghiepId };
    if (query.doiTuong) filter.doiTuong = query.doiTuong;
    if (query.loaiLoHangId) filter.loaiLoHang = query.loaiLoHangId;
    if (query.sanPhamId) filter.sanPham = query.sanPhamId;
    if (query.vatTuId) filter.vatTu = query.vatTuId;
    if (query.keyword) {
      filter.$or = [
        { soLo: { $regex: query.keyword, $options: 'i' } },
        { tenLoHang: { $regex: query.keyword, $options: 'i' } },
        { maTruyVetLoHang: { $regex: query.keyword, $options: 'i' } },
      ];
    }
    return this.loHangModel
      .find(filter)
      .populate(POPULATE_FIELDS)
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(doanhNghiepId: string, id: string) {
    const loHang = await this.loHangModel
      .findOne({ _id: id, doanhNghiep: doanhNghiepId })
      .populate(POPULATE_FIELDS)
      .exec();
    if (!loHang) {
      throw new NotFoundException('Không tìm thấy lô hàng');
    }
    return loHang;
  }

  async update(doanhNghiepId: string, id: string, dto: UpdateLoHangDto) {
    if (dto.donViSanXuatId) {
      const donVi = await this.donViTrucThuocModel
        .findOne({ _id: dto.donViSanXuatId, doanhNghiep: doanhNghiepId })
        .exec();
      if (!donVi) {
        throw new BadRequestException('Đơn vị sản xuất không tồn tại trong doanh nghiệp');
      }
    }
    if (dto.vungSanXuatId) {
      const vungSanXuat = await this.vungSanXuatModel
        .findOne({ _id: dto.vungSanXuatId, doanhNghiep: doanhNghiepId })
        .exec();
      if (!vungSanXuat) {
        throw new BadRequestException('Vùng sản xuất không tồn tại trong doanh nghiệp');
      }
    }
    if (dto.nhaXuongId) {
      const nhaXuong = await this.nhaXuongKhoModel
        .findOne({ _id: dto.nhaXuongId, doanhNghiep: doanhNghiepId })
        .exec();
      if (!nhaXuong) {
        throw new BadRequestException('Nhà xưởng không tồn tại trong doanh nghiệp');
      }
    }
    const loHang = await this.loHangModel
      .findOneAndUpdate({ _id: id, doanhNghiep: doanhNghiepId }, dto, { new: true })
      .exec();
    if (!loHang) {
      throw new NotFoundException('Không tìm thấy lô hàng');
    }
    return loHang;
  }

  /** rule.md: mã truy vết vật phẩm cho phép tự đổi N1 (0-8) khi sửa lô hàng */
  async capNhatN1(doanhNghiepId: string, id: string, n1: number) {
    const loHang = await this.loHangModel
      .findOne({ _id: id, doanhNghiep: doanhNghiepId })
      .exec();
    if (!loHang) {
      throw new NotFoundException('Không tìm thấy lô hàng');
    }
    if (loHang.doiTuong !== DoiTuongLoHang.SAN_PHAM) {
      throw new BadRequestException('Chỉ lô hàng loại sản phẩm mới có N1');
    }
    const sanPham = await this.sanPhamModel.findById(loHang.sanPham).exec();
    if (!sanPham) {
      throw new BadRequestException('Sản phẩm gốc của lô hàng không còn tồn tại');
    }
    loHang.n1 = n1;
    loHang.maTruyVetVatPham = this.codeGeneratorService.generateMaTruyVetVatPham(
      sanPham.maGTIN as string,
      n1,
    );
    await loHang.save();
    return loHang;
  }
}
