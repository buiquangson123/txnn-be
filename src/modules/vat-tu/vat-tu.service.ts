import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  DonViTrucThuoc,
  DonViTrucThuocDocument,
} from '../don-vi-truc-thuoc/schemas/don-vi-truc-thuoc.schema';
import { CreateVatTuDto } from './dto/create-vat-tu.dto';
import { UpdateVatTuDto } from './dto/update-vat-tu.dto';
import { QueryVatTuDto } from './dto/query-vat-tu.dto';
import { VatTu, VatTuDocument } from './schemas/vat-tu.schema';

@Injectable()
export class VatTuService {
  constructor(
    @InjectModel(VatTu.name)
    private readonly vatTuModel: Model<VatTuDocument>,
    @InjectModel(DonViTrucThuoc.name)
    private readonly donViTrucThuocModel: Model<DonViTrucThuocDocument>,
  ) {}

  private async kiemTraNhaCungCap(
    doanhNghiepId: string,
    nhaCungCapId?: string,
  ) {
    if (!nhaCungCapId) return;
    const donVi = await this.donViTrucThuocModel
      .findOne({ _id: nhaCungCapId, doanhNghiep: doanhNghiepId })
      .exec();
    if (!donVi) {
      throw new BadRequestException(
        'Nhà cung cấp không tồn tại trong doanh nghiệp',
      );
    }
  }

  async create(doanhNghiepId: string, dto: CreateVatTuDto) {
    await this.kiemTraNhaCungCap(doanhNghiepId, dto.nhaCungCapId);
    const { nhaCungCapId, ...rest } = dto;
    return this.vatTuModel.create({
      ...rest,
      nhaCungCap: nhaCungCapId,
      doanhNghiep: doanhNghiepId,
    });
  }

  findAll(doanhNghiepId: string, query: QueryVatTuDto) {
    const filter: Record<string, unknown> = { doanhNghiep: doanhNghiepId };
    if (query.nhomVatTu) filter.nhomVatTu = query.nhomVatTu;
    if (query.nhaCungCapId) filter.nhaCungCap = query.nhaCungCapId;
    if (query.keyword) {
      filter.$or = [
        { tenVatTu: { $regex: query.keyword, $options: 'i' } },
        { moTa: { $regex: query.keyword, $options: 'i' } },
      ];
    }
    return this.vatTuModel
      .find(filter)
      .populate('nhaCungCap giayChungNhan')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(doanhNghiepId: string, id: string) {
    const vatTu = await this.vatTuModel
      .findOne({ _id: id, doanhNghiep: doanhNghiepId })
      .populate('nhaCungCap giayChungNhan')
      .exec();
    if (!vatTu) {
      throw new NotFoundException('Không tìm thấy vật tư');
    }
    return vatTu;
  }

  async update(doanhNghiepId: string, id: string, dto: UpdateVatTuDto) {
    await this.kiemTraNhaCungCap(doanhNghiepId, dto.nhaCungCapId);
    const { nhaCungCapId, ...rest } = dto;
    const update: Record<string, unknown> = { ...rest };
    if (nhaCungCapId !== undefined) update.nhaCungCap = nhaCungCapId;

    const vatTu = await this.vatTuModel
      .findOneAndUpdate({ _id: id, doanhNghiep: doanhNghiepId }, update, {
        new: true,
      })
      .populate('nhaCungCap giayChungNhan')
      .exec();
    if (!vatTu) {
      throw new NotFoundException('Không tìm thấy vật tư');
    }
    return vatTu;
  }

  async remove(doanhNghiepId: string, id: string) {
    const dangDuocDung = await this.vatTuModel.db
      .collection('lo_hang')
      .findOne({ vatTu: id });
    if (dangDuocDung) {
      throw new BadRequestException(
        'Không thể xóa vật tư đang được sử dụng bởi lô hàng',
      );
    }
    const vatTu = await this.vatTuModel
      .findOneAndDelete({ _id: id, doanhNghiep: doanhNghiepId })
      .exec();
    if (!vatTu) {
      throw new NotFoundException('Không tìm thấy vật tư');
    }
    return { deleted: true };
  }
}
