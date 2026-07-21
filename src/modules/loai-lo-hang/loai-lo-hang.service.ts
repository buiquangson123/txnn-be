import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CodeGeneratorService } from '../../common/code-generator/code-generator.service';
import { CreateLoaiLoHangDto } from './dto/create-loai-lo-hang.dto';
import { UpdateLoaiLoHangDto } from './dto/update-loai-lo-hang.dto';
import { QueryLoaiLoHangDto } from './dto/query-loai-lo-hang.dto';
import { LoaiLoHang, LoaiLoHangDocument } from './schemas/loai-lo-hang.schema';

@Injectable()
export class LoaiLoHangService {
  constructor(
    @InjectModel(LoaiLoHang.name)
    private readonly loaiLoHangModel: Model<LoaiLoHangDocument>,
    private readonly codeGeneratorService: CodeGeneratorService,
  ) {}

  private async kiemTraTrungVietTat(
    doanhNghiepId: string,
    vietTat: string,
    excludeId?: string,
  ) {
    const filter: Record<string, unknown> = { doanhNghiep: doanhNghiepId, vietTat };
    if (excludeId) filter._id = { $ne: excludeId };
    const trung = await this.loaiLoHangModel.findOne(filter).exec();
    if (trung) {
      throw new BadRequestException(
        'Tên viết tắt đã được dùng bởi loại lô hàng khác trong doanh nghiệp',
      );
    }
  }

  async create(doanhNghiepId: string, dto: CreateLoaiLoHangDto) {
    const vietTat = this.codeGeneratorService.chuanHoaVietTat(
      dto.vietTat ?? dto.tenLoaiLo,
    );
    await this.kiemTraTrungVietTat(doanhNghiepId, vietTat);
    return this.loaiLoHangModel.create({
      tenLoaiLo: dto.tenLoaiLo,
      vietTat,
      doiTuongDiaDiemBatBuoc: dto.doiTuongDiaDiemBatBuoc,
      doanhNghiep: doanhNghiepId,
    });
  }

  findAll(doanhNghiepId: string, query: QueryLoaiLoHangDto) {
    const filter: Record<string, unknown> = { doanhNghiep: doanhNghiepId };
    if (query.keyword) {
      filter.$or = [
        { tenLoaiLo: { $regex: query.keyword, $options: 'i' } },
        { vietTat: { $regex: query.keyword, $options: 'i' } },
      ];
    }
    return this.loaiLoHangModel.find(filter).sort({ tenLoaiLo: 1 }).exec();
  }

  async update(doanhNghiepId: string, id: string, dto: UpdateLoaiLoHangDto) {
    const update: Record<string, unknown> = { ...dto };
    if (dto.vietTat) {
      const vietTat = this.codeGeneratorService.chuanHoaVietTat(dto.vietTat);
      await this.kiemTraTrungVietTat(doanhNghiepId, vietTat, id);
      update.vietTat = vietTat;
    }
    const item = await this.loaiLoHangModel
      .findOneAndUpdate({ _id: id, doanhNghiep: doanhNghiepId }, update, { new: true })
      .exec();
    if (!item) {
      throw new NotFoundException('Không tìm thấy loại lô hàng');
    }
    return item;
  }

  async remove(doanhNghiepId: string, id: string) {
    const item = await this.loaiLoHangModel
      .findOneAndDelete({ _id: id, doanhNghiep: doanhNghiepId })
      .exec();
    if (!item) {
      throw new NotFoundException('Không tìm thấy loại lô hàng');
    }
    return { deleted: true };
  }
}
