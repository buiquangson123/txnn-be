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
import {
  DonViTrucThuoc,
  DonViTrucThuocDocument,
} from '../don-vi-truc-thuoc/schemas/don-vi-truc-thuoc.schema';
import {
  ThanhVien,
  ThanhVienDocument,
} from '../thanh-vien/schemas/thanh-vien.schema';
import { CreateVungSanXuatDto } from './dto/create-vung-san-xuat.dto';
import { UpdateVungSanXuatDto } from './dto/update-vung-san-xuat.dto';
import { QueryVungSanXuatDto } from './dto/query-vung-san-xuat.dto';
import {
  VungSanXuat,
  VungSanXuatDocument,
} from './schemas/vung-san-xuat.schema';

@Injectable()
export class VungSanXuatService {
  constructor(
    @InjectModel(VungSanXuat.name)
    private readonly vungSanXuatModel: Model<VungSanXuatDocument>,
    @InjectModel(DoanhNghiep.name)
    private readonly doanhNghiepModel: Model<DoanhNghiepDocument>,
    @InjectModel(LoaiDiaDiem.name)
    private readonly loaiDiaDiemModel: Model<LoaiDiaDiemDocument>,
    @InjectModel(DonViTrucThuoc.name)
    private readonly donViTrucThuocModel: Model<DonViTrucThuocDocument>,
    @InjectModel(ThanhVien.name)
    private readonly thanhVienModel: Model<ThanhVienDocument>,
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

  private async kiemTraDonViQuanLy(
    doanhNghiepId: string,
    donViQuanLyId?: string,
  ) {
    if (!donViQuanLyId) return;
    const donVi = await this.donViTrucThuocModel
      .findOne({ _id: donViQuanLyId, doanhNghiep: doanhNghiepId })
      .exec();
    if (!donVi) {
      throw new BadRequestException(
        'Đơn vị liên kết không tồn tại trong doanh nghiệp',
      );
    }
  }

  private async kiemTraNguoiPhuTrach(
    doanhNghiepId: string,
    nguoiPhuTrachId?: string,
  ) {
    if (!nguoiPhuTrachId) return;
    const thanhVien = await this.thanhVienModel
      .findOne({ _id: nguoiPhuTrachId, doanhNghiep: doanhNghiepId })
      .exec();
    if (!thanhVien) {
      throw new BadRequestException(
        'Người phụ trách không tồn tại trong doanh nghiệp',
      );
    }
  }

  async create(doanhNghiepId: string, dto: CreateVungSanXuatDto) {
    await this.kiemTraDonViQuanLy(doanhNghiepId, dto.donViQuanLyId);
    await this.kiemTraNguoiPhuTrach(doanhNghiepId, dto.nguoiPhuTrachId);
    const maAI = await this.layMaAI(dto.loaiDiaDiemId);

    let maGLN = dto.maGLN;
    if (maGLN) {
      const trung = await this.vungSanXuatModel.findOne({ maGLN }).exec();
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

    return this.vungSanXuatModel.create({
      doanhNghiep: doanhNghiepId,
      tenVungSanXuat: dto.tenVungSanXuat,
      diaChi: dto.diaChi,
      dienTich: dto.dienTich,
      donViDienTich: dto.donViDienTich,
      moTa: dto.moTa,
      maVungTrongNuoi: dto.maVungTrongNuoi,
      hinhAnh: dto.hinhAnh ?? [],
      nguoiPhuTrach: dto.nguoiPhuTrachId,
      maGLN,
      loaiDiaDiem: dto.loaiDiaDiemId,
      maTruyVetDiaDiem,
      donViQuanLy: dto.donViQuanLyId,
      vido: dto.vido,
      kinhdo: dto.kinhdo,
    });
  }

  findAll(doanhNghiepId: string, query: QueryVungSanXuatDto) {
    const filter: Record<string, unknown> = { doanhNghiep: doanhNghiepId };
    if (query.donViQuanLyId) filter.donViQuanLy = query.donViQuanLyId;
    if (query.keyword) {
      filter.$or = [
        { tenVungSanXuat: { $regex: query.keyword, $options: 'i' } },
        { diaChi: { $regex: query.keyword, $options: 'i' } },
        { maTruyVetDiaDiem: { $regex: query.keyword, $options: 'i' } },
      ];
    }
    return this.vungSanXuatModel
      .find(filter)
      .populate('loaiDiaDiem donViQuanLy nguoiPhuTrach')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(doanhNghiepId: string, id: string) {
    const vungSanXuat = await this.vungSanXuatModel
      .findOne({ _id: id, doanhNghiep: doanhNghiepId })
      .populate('loaiDiaDiem donViQuanLy nguoiPhuTrach')
      .exec();
    if (!vungSanXuat) {
      throw new NotFoundException('Không tìm thấy vùng sản xuất');
    }
    return vungSanXuat;
  }

  async update(doanhNghiepId: string, id: string, dto: UpdateVungSanXuatDto) {
    await this.kiemTraDonViQuanLy(doanhNghiepId, dto.donViQuanLyId);
    await this.kiemTraNguoiPhuTrach(doanhNghiepId, dto.nguoiPhuTrachId);

    // donViQuanLyId/nguoiPhuTrachId là tên field DTO, khác tên ref field trong schema
    // (donViQuanLy/nguoiPhuTrach) nên phải map lại tên trước khi update, tránh Mongoose
    // strict mode âm thầm bỏ qua field không khớp.
    const { donViQuanLyId, nguoiPhuTrachId, ...rest } = dto;
    const update: Record<string, unknown> = { ...rest };
    if (donViQuanLyId !== undefined) update.donViQuanLy = donViQuanLyId;
    if (nguoiPhuTrachId !== undefined) update.nguoiPhuTrach = nguoiPhuTrachId;

    const vungSanXuat = await this.vungSanXuatModel
      .findOneAndUpdate({ _id: id, doanhNghiep: doanhNghiepId }, update, {
        new: true,
      })
      .populate('loaiDiaDiem donViQuanLy nguoiPhuTrach')
      .exec();
    if (!vungSanXuat) {
      throw new NotFoundException('Không tìm thấy vùng sản xuất');
    }
    return vungSanXuat;
  }

  async remove(doanhNghiepId: string, id: string) {
    const dangDuocDung = await this.vungSanXuatModel.db
      .collection('lo_hang')
      .findOne({ vungSanXuat: id });
    if (dangDuocDung) {
      throw new BadRequestException(
        'Không thể xóa vùng sản xuất đang được sử dụng bởi lô hàng',
      );
    }
    const vungSanXuat = await this.vungSanXuatModel
      .findOneAndDelete({ _id: id, doanhNghiep: doanhNghiepId })
      .exec();
    if (!vungSanXuat) {
      throw new NotFoundException('Không tìm thấy vùng sản xuất');
    }
    return { deleted: true };
  }
}
