import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CodeGeneratorService } from '../../common/code-generator/code-generator.service';
import { CounterService } from '../../common/counter/counter.service';
import {
  DoanhNghiep,
  DoanhNghiepDocument,
} from '../doanh-nghiep/schemas/doanh-nghiep.schema';
import {
  LoaiDiaDiem,
  LoaiDiaDiemDocument,
} from '../loai-dia-diem/schemas/loai-dia-diem.schema';
import { CreateNhaXuongKhoDto } from './dto/create-nha-xuong-kho.dto';
import { UpdateNhaXuongKhoDto } from './dto/update-nha-xuong-kho.dto';
import { QueryNhaXuongKhoDto } from './dto/query-nha-xuong-kho.dto';
import {
  NhaXuongKho,
  NhaXuongKhoDocument,
} from './schemas/nha-xuong-kho.schema';

@Injectable()
export class NhaXuongKhoService {
  constructor(
    @InjectModel(NhaXuongKho.name)
    private readonly nhaXuongKhoModel: Model<NhaXuongKhoDocument>,
    @InjectModel(DoanhNghiep.name)
    private readonly doanhNghiepModel: Model<DoanhNghiepDocument>,
    @InjectModel(LoaiDiaDiem.name)
    private readonly loaiDiaDiemModel: Model<LoaiDiaDiemDocument>,
    private readonly codeGeneratorService: CodeGeneratorService,
    private readonly counterService: CounterService,
  ) {}

  private async layMaAI(loaiDiaDiemId: string): Promise<string> {
    const loaiDiaDiem = await this.loaiDiaDiemModel
      .findById(loaiDiaDiemId)
      .exec();
    if (!loaiDiaDiem) {
      throw new BadRequestException('Loại địa điểm không tồn tại');
    }
    return loaiDiaDiem.maAI;
  }

  async create(doanhNghiepId: string, dto: CreateNhaXuongKhoDto) {
    const maAI = await this.layMaAI(dto.loaiDiaDiemId);

    let maGLN = dto.maGLN;
    if (maGLN) {
      const trung = await this.nhaXuongKhoModel.findOne({ maGLN }).exec();
      if (trung) {
        throw new BadRequestException('Mã GLN đã tồn tại, vui lòng nhập lại');
      }
    } else {
      const doanhNghiep = await this.doanhNghiepModel
        .findById(doanhNghiepId)
        .exec();
      if (!doanhNghiep) {
        throw new BadRequestException('Doanh nghiệp không tồn tại');
      }
      const seq = await this.counterService.getNextSequence(
        `ma_dia_diem:${doanhNghiepId}`,
      );
      maGLN = this.codeGeneratorService.generateGtinOrGlnNoiBo(
        doanhNghiep.maDoanhNghiep,
        String(seq).padStart(4, '0'),
      );
    }

    const maTruyVetDiaDiem = this.codeGeneratorService.generateMaTruyVetDiaDiem(
      maAI,
      maGLN,
    );

    return this.nhaXuongKhoModel.create({
      doanhNghiep: doanhNghiepId,
      tenDiaDiem: dto.tenDiaDiem,
      diaChi: dto.diaChi,
      nguoiPhuTrach: dto.nguoiPhuTrach,
      congSuat: dto.congSuat,
      dienTich: dto.dienTich,
      maCoSoChanNuoiDongGoi: dto.maCoSoChanNuoiDongGoi,
      hinhAnh: dto.hinhAnh ?? [],
      maGLN,
      loaiDiaDiem: dto.loaiDiaDiemId,
      maTruyVetDiaDiem,
    });
  }

  findAll(doanhNghiepId: string, query: QueryNhaXuongKhoDto) {
    const filter: Record<string, unknown> = { doanhNghiep: doanhNghiepId };
    if (query.keyword) {
      filter.$or = [
        { tenDiaDiem: { $regex: query.keyword, $options: 'i' } },
        { diaChi: { $regex: query.keyword, $options: 'i' } },
        { maTruyVetDiaDiem: { $regex: query.keyword, $options: 'i' } },
      ];
    }
    return this.nhaXuongKhoModel
      .find(filter)
      .populate('loaiDiaDiem')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(doanhNghiepId: string, id: string) {
    const nhaXuongKho = await this.nhaXuongKhoModel
      .findOne({ _id: id, doanhNghiep: doanhNghiepId })
      .populate('loaiDiaDiem')
      .exec();
    if (!nhaXuongKho) {
      throw new NotFoundException('Không tìm thấy nhà xưởng/kho');
    }
    return nhaXuongKho;
  }

  async update(doanhNghiepId: string, id: string, dto: UpdateNhaXuongKhoDto) {
    const nhaXuongKho = await this.nhaXuongKhoModel
      .findOneAndUpdate({ _id: id, doanhNghiep: doanhNghiepId }, dto, {
        new: true,
      })
      .exec();
    if (!nhaXuongKho) {
      throw new NotFoundException('Không tìm thấy nhà xưởng/kho');
    }
    return nhaXuongKho;
  }

  async remove(doanhNghiepId: string, id: string) {
    const dangDuocDung = await this.nhaXuongKhoModel.db
      .collection('lo_hang')
      .findOne({ nhaXuongSanXuat: id });
    if (dangDuocDung) {
      throw new BadRequestException(
        'Không thể xóa nhà xưởng/kho đang được sử dụng bởi lô hàng',
      );
    }
    const nhaXuongKho = await this.nhaXuongKhoModel
      .findOneAndDelete({ _id: id, doanhNghiep: doanhNghiepId })
      .exec();
    if (!nhaXuongKho) {
      throw new NotFoundException('Không tìm thấy nhà xưởng/kho');
    }
    return { deleted: true };
  }
}
