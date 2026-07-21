import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateDonViTrucThuocDto } from './dto/create-don-vi-truc-thuoc.dto';
import { UpdateDonViTrucThuocDto } from './dto/update-don-vi-truc-thuoc.dto';
import { QueryDonViTrucThuocDto } from './dto/query-don-vi-truc-thuoc.dto';
import {
  DonViTrucThuoc,
  DonViTrucThuocDocument,
  TrangThaiLienKet,
} from './schemas/don-vi-truc-thuoc.schema';

@Injectable()
export class DonViTrucThuocService {
  constructor(
    @InjectModel(DonViTrucThuoc.name)
    private readonly donViTrucThuocModel: Model<DonViTrucThuocDocument>,
  ) {}

  create(doanhNghiepId: string, dto: CreateDonViTrucThuocDto) {
    return this.donViTrucThuocModel.create({ ...dto, doanhNghiep: doanhNghiepId });
  }

  findAll(doanhNghiepId: string, query: QueryDonViTrucThuocDto) {
    const filter: Record<string, unknown> = { doanhNghiep: doanhNghiepId };
    if (query.loaiHinh) filter.loaiHinh = query.loaiHinh;
    if (query.trangThai) filter.trangThai = query.trangThai;
    if (query.keyword) {
      filter.$or = [
        { tenDonVi: { $regex: query.keyword, $options: 'i' } },
        { maSoThueHoacMaDangKy: { $regex: query.keyword, $options: 'i' } },
        { soDienThoai: { $regex: query.keyword, $options: 'i' } },
      ];
    }
    return this.donViTrucThuocModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  async findOne(doanhNghiepId: string, id: string) {
    const donVi = await this.donViTrucThuocModel
      .findOne({ _id: id, doanhNghiep: doanhNghiepId })
      .exec();
    if (!donVi) {
      throw new NotFoundException('Không tìm thấy đơn vị trực thuộc');
    }
    return donVi;
  }

  async update(doanhNghiepId: string, id: string, dto: UpdateDonViTrucThuocDto) {
    const donVi = await this.donViTrucThuocModel
      .findOneAndUpdate({ _id: id, doanhNghiep: doanhNghiepId }, dto, { new: true })
      .exec();
    if (!donVi) {
      throw new NotFoundException('Không tìm thấy đơn vị trực thuộc');
    }
    return donVi;
  }

  private async doiTrangThai(
    doanhNghiepId: string,
    id: string,
    trangThai: TrangThaiLienKet,
  ) {
    const donVi = await this.donViTrucThuocModel
      .findOneAndUpdate({ _id: id, doanhNghiep: doanhNghiepId }, { trangThai }, { new: true })
      .exec();
    if (!donVi) {
      throw new NotFoundException('Không tìm thấy đơn vị trực thuộc');
    }
    return donVi;
  }

  ngungLienKet(doanhNghiepId: string, id: string) {
    return this.doiTrangThai(doanhNghiepId, id, TrangThaiLienKet.NGUNG_LIEN_KET);
  }

  khoiPhucLienKet(doanhNghiepId: string, id: string) {
    return this.doiTrangThai(doanhNghiepId, id, TrangThaiLienKet.DANG_LIEN_KET);
  }
}
