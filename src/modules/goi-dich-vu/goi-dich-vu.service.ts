import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateGoiDichVuDto } from './dto/create-goi-dich-vu.dto';
import { UpdateGoiDichVuDto } from './dto/update-goi-dich-vu.dto';
import { QueryGoiDichVuDto } from './dto/query-goi-dich-vu.dto';
import { GoiDichVu, GoiDichVuDocument } from './schemas/goi-dich-vu.schema';

@Injectable()
export class GoiDichVuService {
  constructor(
    @InjectModel(GoiDichVu.name)
    private readonly goiDichVuModel: Model<GoiDichVuDocument>,
  ) {}

  create(dto: CreateGoiDichVuDto) {
    return this.goiDichVuModel.create(dto);
  }

  findAll(query: QueryGoiDichVuDto) {
    const filter: Record<string, unknown> = {};
    if (query.trangThai) {
      filter.trangThai = query.trangThai;
    }
    if (query.keyword) {
      filter.tenGoi = { $regex: query.keyword, $options: 'i' };
    }
    return this.goiDichVuModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string) {
    const goiDichVu = await this.goiDichVuModel.findById(id).exec();
    if (!goiDichVu) {
      throw new NotFoundException('Không tìm thấy gói dịch vụ');
    }
    return goiDichVu;
  }

  async update(id: string, dto: UpdateGoiDichVuDto) {
    const goiDichVu = await this.goiDichVuModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!goiDichVu) {
      throw new NotFoundException('Không tìm thấy gói dịch vụ');
    }
    return goiDichVu;
  }

  async remove(id: string) {
    const goiDichVu = await this.goiDichVuModel.findById(id).exec();
    if (!goiDichVu) {
      throw new NotFoundException('Không tìm thấy gói dịch vụ');
    }
    const dangDuocGan = await this.goiDichVuModel.db
      .collection('doanh_nghiep')
      .findOne({ goiDichVu: goiDichVu._id });
    if (dangDuocGan) {
      throw new BadRequestException(
        'Không thể xóa gói dịch vụ đang được gán cho doanh nghiệp',
      );
    }
    await goiDichVu.deleteOne();
    return { deleted: true };
  }
}
