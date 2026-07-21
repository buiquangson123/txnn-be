import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateLoaiDiaDiemDto } from './dto/create-loai-dia-diem.dto';
import { UpdateLoaiDiaDiemDto } from './dto/update-loai-dia-diem.dto';
import { QueryLoaiDiaDiemDto } from './dto/query-loai-dia-diem.dto';
import {
  LoaiDiaDiem,
  LoaiDiaDiemDocument,
} from './schemas/loai-dia-diem.schema';

@Injectable()
export class LoaiDiaDiemService {
  constructor(
    @InjectModel(LoaiDiaDiem.name)
    private readonly loaiDiaDiemModel: Model<LoaiDiaDiemDocument>,
  ) {}

  async create(dto: CreateLoaiDiaDiemDto) {
    const trung = await this.loaiDiaDiemModel
      .findOne({ maAI: dto.maAI })
      .exec();
    if (trung) {
      throw new BadRequestException('Mã AI đã tồn tại');
    }
    return this.loaiDiaDiemModel.create(dto);
  }

  findAll(query: QueryLoaiDiaDiemDto) {
    const filter: Record<string, unknown> = {};
    if (query.keyword) {
      filter.$or = [
        { tenChuThich: { $regex: query.keyword, $options: 'i' } },
        { maAI: { $regex: query.keyword, $options: 'i' } },
      ];
    }
    return this.loaiDiaDiemModel.find(filter).sort({ thuTuHienThi: 1 }).exec();
  }

  async update(id: string, dto: UpdateLoaiDiaDiemDto) {
    const loaiDiaDiem = await this.loaiDiaDiemModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!loaiDiaDiem) {
      throw new NotFoundException('Không tìm thấy loại địa điểm');
    }
    return loaiDiaDiem;
  }

  async remove(id: string) {
    const loaiDiaDiem = await this.loaiDiaDiemModel
      .findByIdAndDelete(id)
      .exec();
    if (!loaiDiaDiem) {
      throw new NotFoundException('Không tìm thấy loại địa điểm');
    }
    return { deleted: true };
  }
}
