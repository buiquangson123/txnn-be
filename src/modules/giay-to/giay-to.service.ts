import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateGiayToDto } from './dto/create-giay-to.dto';
import { UpdateGiayToDto } from './dto/update-giay-to.dto';
import { QueryGiayToDto } from './dto/query-giay-to.dto';
import { GiayTo, GiayToDocument } from './schemas/giay-to.schema';

const NGUONG_SAP_HET_HAN_MAC_DINH = 30;

@Injectable()
export class GiayToService {
  constructor(
    @InjectModel(GiayTo.name)
    private readonly giayToModel: Model<GiayToDocument>,
  ) {}

  private tinhTrangThai(ngayHetHan?: Date): string {
    if (!ngayHetHan) return 'khong_thoi_han';
    const now = Date.now();
    const het = new Date(ngayHetHan).getTime();
    if (het < now) return 'het_han';
    const conLaiNgay = (het - now) / (1000 * 60 * 60 * 24);
    if (conLaiNgay <= NGUONG_SAP_HET_HAN_MAC_DINH) return 'sap_het_han';
    return 'con_han';
  }

  private gomTrangThai<T extends { ngayHetHan?: Date }>(doc: T) {
    return { ...doc, trangThai: this.tinhTrangThai(doc.ngayHetHan) };
  }

  create(doanhNghiepId: string, dto: CreateGiayToDto) {
    return this.giayToModel.create({ ...dto, doanhNghiep: doanhNghiepId });
  }

  async findAll(doanhNghiepId: string, query: QueryGiayToDto) {
    const filter: Record<string, unknown> = { doanhNghiep: doanhNghiepId };
    if (query.keyword) {
      filter.$or = [
        { tenGiayTo: { $regex: query.keyword, $options: 'i' } },
        { soHieu: { $regex: query.keyword, $options: 'i' } },
      ];
    }
    if (query.sapHetHanTrongNgay !== undefined) {
      const nguong = new Date(
        Date.now() + query.sapHetHanTrongNgay * 24 * 60 * 60 * 1000,
      );
      filter.ngayHetHan = { $lte: nguong };
    }
    const items = await this.giayToModel
      .find(filter)
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    return items.map((item) => this.gomTrangThai(item));
  }

  async findOne(doanhNghiepId: string, id: string) {
    const giayTo = await this.giayToModel
      .findOne({ _id: id, doanhNghiep: doanhNghiepId })
      .lean()
      .exec();
    if (!giayTo) {
      throw new NotFoundException('Không tìm thấy giấy tờ');
    }
    return this.gomTrangThai(giayTo);
  }

  async update(doanhNghiepId: string, id: string, dto: UpdateGiayToDto) {
    const giayTo = await this.giayToModel
      .findOneAndUpdate({ _id: id, doanhNghiep: doanhNghiepId }, dto, {
        new: true,
      })
      .exec();
    if (!giayTo) {
      throw new NotFoundException('Không tìm thấy giấy tờ');
    }
    return giayTo;
  }

  async remove(doanhNghiepId: string, id: string) {
    const giayTo = await this.giayToModel
      .findOneAndDelete({ _id: id, doanhNghiep: doanhNghiepId })
      .exec();
    if (!giayTo) {
      throw new NotFoundException('Không tìm thấy giấy tờ');
    }
    return { deleted: true };
  }
}
