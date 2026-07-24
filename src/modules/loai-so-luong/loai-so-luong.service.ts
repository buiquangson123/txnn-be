import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateLoaiSoLuongDto } from './dto/create-loai-so-luong.dto';
import { UpdateLoaiSoLuongDto } from './dto/update-loai-so-luong.dto';
import { QueryLoaiSoLuongDto } from './dto/query-loai-so-luong.dto';
import {
  LoaiSoLuong,
  LoaiSoLuongDocument,
} from './schemas/loai-so-luong.schema';

@Injectable()
export class LoaiSoLuongService {
  constructor(
    @InjectModel(LoaiSoLuong.name)
    private readonly loaiSoLuongModel: Model<LoaiSoLuongDocument>,
  ) {}

  create(doanhNghiepId: string, dto: CreateLoaiSoLuongDto) {
    return this.loaiSoLuongModel.create({ ...dto, doanhNghiep: doanhNghiepId });
  }

  findAll(doanhNghiepId: string, query: QueryLoaiSoLuongDto) {
    const filter: Record<string, unknown> = { doanhNghiep: doanhNghiepId };
    if (query.keyword) {
      filter.tenDonVi = { $regex: query.keyword, $options: 'i' };
    }
    return this.loaiSoLuongModel.find(filter).sort({ tenDonVi: 1 }).exec();
  }

  async update(doanhNghiepId: string, id: string, dto: UpdateLoaiSoLuongDto) {
    const item = await this.loaiSoLuongModel
      .findOneAndUpdate({ _id: id, doanhNghiep: doanhNghiepId }, dto, {
        new: true,
      })
      .exec();
    if (!item) {
      throw new NotFoundException('Không tìm thấy loại số lượng');
    }
    return item;
  }

  async remove(doanhNghiepId: string, id: string) {
    const item = await this.loaiSoLuongModel
      .findOneAndDelete({ _id: id, doanhNghiep: doanhNghiepId })
      .exec();
    if (!item) {
      throw new NotFoundException('Không tìm thấy loại số lượng');
    }
    return { deleted: true };
  }
}
