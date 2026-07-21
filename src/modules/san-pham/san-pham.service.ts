import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import * as QRCode from 'qrcode';
import { CodeGeneratorService } from '../../common/code-generator/code-generator.service';
import { CounterService } from '../../common/counter/counter.service';
import { DoanhNghiep, DoanhNghiepDocument } from '../doanh-nghiep/schemas/doanh-nghiep.schema';
import { CreateSanPhamDto } from './dto/create-san-pham.dto';
import { UpdateSanPhamDto } from './dto/update-san-pham.dto';
import { QuerySanPhamDto } from './dto/query-san-pham.dto';
import { SanPham, SanPhamDocument, TrangThaiSanPham } from './schemas/san-pham.schema';

const N1_KHOI_TAO = 0;

@Injectable()
export class SanPhamService {
  constructor(
    @InjectModel(SanPham.name)
    private readonly sanPhamModel: Model<SanPhamDocument>,
    @InjectModel(DoanhNghiep.name)
    private readonly doanhNghiepModel: Model<DoanhNghiepDocument>,
    private readonly codeGeneratorService: CodeGeneratorService,
    private readonly counterService: CounterService,
    private readonly configService: ConfigService,
  ) {}

  async create(doanhNghiepId: string, dto: CreateSanPhamDto) {
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
      const doanhNghiep = await this.doanhNghiepModel.findById(doanhNghiepId).exec();
      if (!doanhNghiep) {
        throw new BadRequestException('Doanh nghiệp không tồn tại');
      }
      const seq = await this.counterService.getNextSequence(`ma_vat_pham:${doanhNghiepId}`);
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
      doanhNghiep: doanhNghiepId,
      tenSanPham: dto.tenSanPham,
      nhomSanPham: dto.nhomSanPham,
      quyCach: dto.quyCach,
      donViTinh: dto.donViTinh,
      hinhAnh: dto.hinhAnh ?? [],
      maGTIN,
      maTruyVetVatPham,
      giayChungNhan: dto.giayChungNhan ?? [],
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
    return this.sanPhamModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  async findOne(doanhNghiepId: string, id: string) {
    const sanPham = await this.sanPhamModel
      .findOne({ _id: id, doanhNghiep: doanhNghiepId })
      .populate('giayChungNhan')
      .exec();
    if (!sanPham) {
      throw new NotFoundException('Không tìm thấy sản phẩm');
    }
    return sanPham;
  }

  async update(doanhNghiepId: string, id: string, dto: UpdateSanPhamDto) {
    const sanPham = await this.sanPhamModel
      .findOneAndUpdate({ _id: id, doanhNghiep: doanhNghiepId }, dto, { new: true })
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
      .findOneAndUpdate({ _id: id, doanhNghiep: doanhNghiepId }, { trangThai }, { new: true })
      .exec();
    if (!sanPham) {
      throw new NotFoundException('Không tìm thấy sản phẩm');
    }
    return sanPham;
  }

  ngungKinhDoanh(doanhNghiepId: string, id: string) {
    return this.doiTrangThai(doanhNghiepId, id, TrangThaiSanPham.NGUNG_KINH_DOANH);
  }

  moBanLai(doanhNghiepId: string, id: string) {
    return this.doiTrangThai(doanhNghiepId, id, TrangThaiSanPham.DANG_BAN);
  }

  /** Sinh ảnh QR (PNG buffer) trỏ tới trang truy xuất công khai của sản phẩm. */
  async sinhMaQR(doanhNghiepId: string, id: string): Promise<{ buffer: Buffer; tenSanPham: string }> {
    const sanPham = await this.sanPhamModel
      .findOne({ _id: id, doanhNghiep: doanhNghiepId })
      .exec();
    if (!sanPham) {
      throw new NotFoundException('Không tìm thấy sản phẩm');
    }
    const baseUrl = this.configService.get<string>(
      'PUBLIC_TRACE_BASE_URL',
      'https://trace.example.com/san-pham',
    );
    const noiDung = `${baseUrl}/${sanPham.maTruyVetVatPham}`;
    const buffer = await QRCode.toBuffer(noiDung, { type: 'png', width: 400 });
    return { buffer, tenSanPham: sanPham.tenSanPham };
  }
}
