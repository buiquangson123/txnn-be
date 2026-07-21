import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { LoaiDiaDiemService } from '../modules/loai-dia-diem/loai-dia-diem.service';

const DANH_SACH_MAC_DINH = [
  { maAI: '410', tenChuThich: 'Mã truy vết địa điểm vật phẩm gửi đến' },
  { maAI: '411', tenChuThich: 'Mã truy vết địa điểm đơn vị nhận hóa đơn' },
  { maAI: '412', tenChuThich: 'Mã truy vết địa điểm mua vật phẩm' },
  { maAI: '413', tenChuThich: 'Mã truy vết địa điểm (nội bộ hoặc chuyển tiền)' },
  { maAI: '414', tenChuThich: 'Mã truy vết địa điểm vật lý' },
  { maAI: '415', tenChuThich: 'Mã truy vết địa điểm đơn vị lập hóa đơn' },
  { maAI: '416', tenChuThich: 'Mã truy vết địa điểm sản xuất, cung cấp dịch vụ' },
  { maAI: '417', tenChuThich: 'Mã truy vết địa điểm đối tác' },
];

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const service = app.get(LoaiDiaDiemService);

  for (let i = 0; i < DANH_SACH_MAC_DINH.length; i++) {
    const item = DANH_SACH_MAC_DINH[i];
    try {
      await service.create({ ...item, thuTuHienThi: i });
      console.log('Đã tạo:', item.maAI);
    } catch {
      console.log('Bỏ qua (đã tồn tại):', item.maAI);
    }
  }

  await app.close();
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
