import { Injectable } from '@nestjs/common';

@Injectable()
export class CodeGeneratorService {
  /** GS1 mod-10 check digit: rightmost data digit weighted x3, alternating. */
  checkDigitMod10(digits: string): number {
    let sum = 0;
    for (let i = 0; i < digits.length; i++) {
      const fromRight = digits.length - 1 - i;
      const weight = fromRight % 2 === 0 ? 3 : 1;
      sum += Number(digits[i]) * weight;
    }
    return (10 - (sum % 10)) % 10;
  }

  /** rule.md 2.1: [Mã DN icheck 7 số] + 000001-999999 */
  generateMaDoanhNghiep(icheckPrefix7So: string, sequence: number): string {
    return `${icheckPrefix7So}${String(sequence).padStart(6, '0')}`;
  }

  /**
   * rule.md 2.3/2.4 nhánh DN không có GTIN/GLN:
   * [200] + [Mã DN KH 13 số] + [Mã 4 số: 0001-9999] + [Số kiểm tra]
   * Dùng chung cho cả sinh GTIN (sản phẩm) và sinh GLN (địa điểm).
   */
  generateGtinOrGlnNoiBo(maDoanhNghiepKH13So: string, ma4So: string): string {
    const base = `200${maDoanhNghiepKH13So}${ma4So.padStart(4, '0')}`;
    return `${base}${this.checkDigitMod10(base)}`;
  }

  /**
   * rule.md 1.3/2.3: [01](ẩn) + [N1: 0-8] + [GTIN]
   * N1: lô đầu tiên = 0; gán 1 nguyên liệu = 1; gán nhiều nguyên liệu = N1 cao nhất trong các lô gán + 1 (tối đa 8)
   */
  generateMaTruyVetVatPham(gtin: string, n1: number): string {
    if (n1 < 0 || n1 > 8) {
      throw new Error('N1 phải nằm trong khoảng 0-8');
    }
    return `01${n1}${gtin}`;
  }

  /** rule.md mục mã truy vết địa điểm: [Số định danh ứng dụng theo Loại địa điểm] + [GLN] */
  generateMaTruyVetDiaDiem(aiCode: string, gln: string): string {
    return `${aiCode}${gln}`;
  }

  /** rule.md 1.3 cuối / 2.3 cuối: Mã truy vết lô hàng = GTIN + Số lô */
  generateMaTruyVetLoHang(gtin: string, soLo: string): string {
    return `${gtin}${soLo}`;
  }

  /**
   * rule.md: Số lô = [TH] + [ddmmyy] + [STT], tối đa 20 ký tự.
   * TH: viết tắt loại lô hàng (in hoa không dấu, <=10 ký tự) - truyền sẵn từ caller.
   * STT: 001-999, số thứ tự lô tạo trong ngày - caller phải tự đếm theo DN/ngày trước khi gọi hàm này.
   */
  generateSoLo(vietTat: string, ngayTao: Date, stt: number): string {
    if (stt < 1 || stt > 999) {
      throw new Error('STT phải nằm trong khoảng 1-999');
    }
    const dd = String(ngayTao.getDate()).padStart(2, '0');
    const mm = String(ngayTao.getMonth() + 1).padStart(2, '0');
    const yy = String(ngayTao.getFullYear()).slice(-2);
    const soLo = `${vietTat}${dd}${mm}${yy}${String(stt).padStart(3, '0')}`;
    if (soLo.length > 20) {
      throw new Error('Số lô vượt quá 20 ký tự, hãy rút ngắn tên viết tắt loại lô hàng');
    }
    return soLo;
  }

  /** Chuẩn hóa tên viết tắt loại lô hàng: in hoa, bỏ dấu, <=10 ký tự */
  chuanHoaVietTat(input: string): string {
    const khongDau = input
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/đ/gi, 'd')
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '');
    return khongDau.slice(0, 10);
  }
}
