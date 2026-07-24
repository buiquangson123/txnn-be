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

  async create(doanhNghiepId: string, dto: CreateDonViTrucThuocDto) {
    const maAI = await this.layMaAI(dto.loaiDiaDiemId);

    let maGLN = dto.maGLN;
    if (maGLN) {
      const trung = await this.donViTrucThuocModel.findOne({ maGLN }).exec();
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

    return this.donViTrucThuocModel.create({
      doanhNghiep: doanhNghiepId,
      tenDonVi: dto.tenDonVi,
      loaiHinh: dto.loaiHinh,
      vaiTro: dto.vaiTro ?? [],
      maSoThue: dto.maSoThue,
      nguoiDaiDien: dto.nguoiDaiDien,
      soDienThoai: dto.soDienThoai,
      diaChi: dto.diaChi,
      hinhAnh: dto.hinhAnh ?? [],
      maGLN,
      loaiDiaDiem: dto.loaiDiaDiemId,
      maTruyVetDiaDiem,
    });
  }

  findAll(doanhNghiepId: string, query: QueryDonViTrucThuocDto) {
    const filter: Record<string, unknown> = { doanhNghiep: doanhNghiepId };
    if (query.loaiHinh) filter.loaiHinh = query.loaiHinh;
    if (query.trangThai) filter.trangThai = query.trangThai;
    if (query.keyword) {
      filter.$or = [
        { tenDonVi: { $regex: query.keyword, $options: 'i' } },
        { maSoThue: { $regex: query.keyword, $options: 'i' } },
        { soDienThoai: { $regex: query.keyword, $options: 'i' } },
      ];
    }
    return this.donViTrucThuocModel
      .find(filter)
      .populate('loaiDiaDiem')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(doanhNghiepId: string, id: string) {
    const donVi = await this.donViTrucThuocModel
      .findOne({ _id: id, doanhNghiep: doanhNghiepId })
      .populate('loaiDiaDiem')
      .exec();
    if (!donVi) {
      throw new NotFoundException('Không tìm thấy đơn vị trực thuộc');
    }
    return donVi;
  }

  async update(
    doanhNghiepId: string,
    id: string,
    dto: UpdateDonViTrucThuocDto,
  ) {
    const donVi = await this.donViTrucThuocModel
      .findOneAndUpdate({ _id: id, doanhNghiep: doanhNghiepId }, dto, {
        new: true,
      })
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
      .findOneAndUpdate(
        { _id: id, doanhNghiep: doanhNghiepId },
        { trangThai },
        { new: true },
      )
      .exec();
    if (!donVi) {
      throw new NotFoundException('Không tìm thấy đơn vị trực thuộc');
    }
    return donVi;
  }

  ngungLienKet(doanhNghiepId: string, id: string) {
    return this.doiTrangThai(
      doanhNghiepId,
      id,
      TrangThaiLienKet.NGUNG_LIEN_KET,
    );
  }

  khoiPhucLienKet(doanhNghiepId: string, id: string) {
    return this.doiTrangThai(doanhNghiepId, id, TrangThaiLienKet.DANG_LIEN_KET);
  }
}
