import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateLoaiKhoiLuongDto } from './dto/create-loai-khoi-luong.dto';
import { UpdateLoaiKhoiLuongDto } from './dto/update-loai-khoi-luong.dto';
import { QueryLoaiKhoiLuongDto } from './dto/query-loai-khoi-luong.dto';
import {
  LoaiKhoiLuong,
  LoaiKhoiLuongDocument,
} from './schemas/loai-khoi-luong.schema';

@Injectable()
export class LoaiKhoiLuongService {
  constructor(
    @InjectModel(LoaiKhoiLuong.name)
    private readonly loaiKhoiLuongModel: Model<LoaiKhoiLuongDocument>,
  ) {}

  create(doanhNghiepId: string, dto: CreateLoaiKhoiLuongDto) {
    return this.loaiKhoiLuongModel.create({
      ...dto,
      doanhNghiep: doanhNghiepId,
    });
  }

  findAll(doanhNghiepId: string, query: QueryLoaiKhoiLuongDto) {
    const filter: Record<string, unknown> = { doanhNghiep: doanhNghiepId };
    if (query.keyword) {
      filter.tenDonVi = { $regex: query.keyword, $options: 'i' };
    }
    return this.loaiKhoiLuongModel.find(filter).sort({ tenDonVi: 1 }).exec();
  }

  async update(doanhNghiepId: string, id: string, dto: UpdateLoaiKhoiLuongDto) {
    const item = await this.loaiKhoiLuongModel
      .findOneAndUpdate({ _id: id, doanhNghiep: doanhNghiepId }, dto, {
        new: true,
      })
      .exec();
    if (!item) {
      throw new NotFoundException('Không tìm thấy loại khối lượng');
    }
    return item;
  }

  async remove(doanhNghiepId: string, id: string) {
    const item = await this.loaiKhoiLuongModel
      .findOneAndDelete({ _id: id, doanhNghiep: doanhNghiepId })
      .exec();
    if (!item) {
      throw new NotFoundException('Không tìm thấy loại khối lượng');
    }
    return { deleted: true };
  }
}
