import { Role } from '../../common/enums/role.enum';

export interface JwtPayload {
  sub: string;
  soDienThoai: string;
  vaiTro: Role;
  doanhNghiepId?: string;
}
