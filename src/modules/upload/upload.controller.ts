import {
  BadRequestException,
  Controller,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

const CAC_LOAI_DUOC_PHEP = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];
const KICH_THUOC_TOI_DA = 10 * 1024 * 1024;
const THU_MUC_HOP_LE = /^[a-z0-9-]+$/;

@UseGuards(JwtAuthGuard)
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: KICH_THUOC_TOI_DA },
    }),
  )
  async upload(@UploadedFile() file: Express.Multer.File, @Query('folder') folder?: string) {
    if (!file) {
      throw new BadRequestException('Vui lòng chọn file để tải lên');
    }
    if (!CAC_LOAI_DUOC_PHEP.includes(file.mimetype)) {
      throw new BadRequestException('Chỉ chấp nhận file ảnh (jpg, png, webp, gif) hoặc PDF');
    }
    const thuMuc = folder && THU_MUC_HOP_LE.test(folder) ? folder : 'chung';
    const url = await this.uploadService.uploadFile(file, thuMuc);
    return { url };
  }
}
