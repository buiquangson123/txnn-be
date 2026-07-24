# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

NestJS backend for a **product traceability system** (truy xuất nguồn gốc) used by Vietnamese
agricultural businesses/cooperatives (doanh nghiệp / HTX / tổ hợp tác). A System Admin onboards
businesses and assigns service packages; each business then manages its own members, production
zones, materials, products, batches, and traceability logs, which are shown on a public-facing site
when a consumer scans a product/batch QR code. **This repo is the admin API only** — the public
consumer-facing site is a separate project not in this repo. The companion admin frontend lives in
the sibling repo `txnn-admin-fe` (Next.js).

Deployed at `https://txnn-be.onrender.com` (Render free tier — cold starts after ~15 min idle).
Database: MongoDB Atlas free tier (M0), shared with local dev — there is no separate prod database.

## Commands

```bash
npm run start:dev      # dev server with watch (default port 3000, or $PORT)
npm run build           # compile to dist/
npm run start:prod      # run compiled build (node dist/main)
npm run lint            # eslint --fix
npm test                # jest unit tests
npm run test:e2e        # jest e2e (test/*.e2e-spec.ts)
npx jest path/to/file.spec.ts   # run a single test file
npm run seed:admin -- <soDienThoai> <matKhau> [hoTen]   # create a System Admin account
npm run seed:loai-dia-diem                               # seed the 8 standard GS1 AI location types (410-417)
```

There is currently no real test coverage beyond the default Nest scaffold
(`app.controller.spec.ts`, `test/app.e2e-spec.ts`). All 14 modules were verified manually via curl
during development, not via automated tests — add real tests as modules are touched.

## Architecture

### Multi-tenancy is the core invariant

Every doanh-nghiep-scoped module (thanh-vien, san-pham, lo-hang, vung-san-xuat, etc.) stores a
`doanhNghiep` field and **must** filter every query by it. Services accept `doanhNghiepId` as an
explicit first parameter (`create(doanhNghiepId, dto)`, `findAll(doanhNghiepId, query)`, etc.) so
tenant scoping is visible at every call site rather than hidden in a global context.

Controllers resolve `doanhNghiepId` via the `@DoanhNghiepId()` param decorator
(`src/modules/auth/decorators/doanh-nghiep-id.decorator.ts`), **not** `@CurrentUser()` directly —
this is what gives System Admin cross-tenant access (see below). Every DN-scoped controller must
also list `Role.SYSTEM_ADMIN` first in its `@Roles(...)` decorator alongside the business roles.

#### System Admin full cross-tenant access

System Admin accounts have no `doanhNghiepId` in their JWT (they don't belong to any business) but
are allowed to read/write **any** business's data. `@DoanhNghiepId()` implements this split:

- `system_admin` role → `doanhNghiepId` is read from a **required** `?doanhNghiepId=<id>` query
  param; a 400 is thrown if it's missing. The client (admin-web) is responsible for always sending
  it once a System Admin has picked a business to operate on — see `admin-web/CLAUDE.md`'s
  "System Admin DN context" section.
- Any other role → `doanhNghiepId` is read from the JWT (`user.doanhNghiepId`) and any client-
  supplied query value is silently ignored, so a DN account can never impersonate another tenant by
  passing `?doanhNghiepId=` itself.

When adding a new DN-scoped module, copy this pattern exactly (`@Roles(Role.SYSTEM_ADMIN, ...)` +
`@DoanhNghiepId()` on every method) rather than reaching for `@CurrentUser()`.

`GoiDichVu` and `LoaiDiaDiem` are the only two collections that are **global** (not tenant-scoped):
service packages are managed by System Admin and assigned to businesses; `LoaiDiaDiem` is the
shared GS1 AI-code catalog (410-417) readable by everyone, writable only by System Admin.

### Auth / RBAC

JWT payload: `{ sub, soDienThoai, vaiTro, doanhNghiepId? }` (see `jwt-payload.interface.ts`).
`doanhNghiepId` is absent for `system_admin` accounts. Two guards compose on every protected route:
`JwtAuthGuard` (validates the token) + `RolesGuard` reading `@Roles(...)` metadata against
`vaiTro`. Roles: `system_admin`, `admin_doanh_nghiep`, `quan_ly`, `nhan_vien` (see
`common/enums/role.enum.ts`). There is no self-registration — a System Admin creates a business via
`POST /doanh-nghiep`, which internally calls `ThanhVienService.taoAdminDauTien()` to create that
business's first `admin_doanh_nghiep` account and return a one-time temporary password in the API
response (never re-fetchable afterward).

### Traceability code generation (`common/code-generator`)

This is the trickiest domain logic in the codebase and mirrors GS1 conventions used by the
business (see the `rule.md` reference the requirements were derived from — not present in this
repo). Key formulas, all implemented in `CodeGeneratorService`:

- **Số lô (batch number)**: `[viết tắt loại lô hàng][ddmmyy][STT 001-999]`, ≤20 chars. STT resets
  daily per business via the atomic counter (see below), keyed `so_lo:<doanhNghiepId>:<ddmmyy>`.
- **Mã truy vết vật phẩm (item trace code)**: `01 + N1 + GTIN`. `N1` (0-8) depends on batch lineage:
  0 for a first-ever batch, 1 if exactly one input-material batch is linked, otherwise
  `max(N1 of linked batches) + 1` (capped at 8) — see `LoHangService.tinhN1()`. Only batches whose
  `doiTuong === 'san_pham'` carry an N1/item-trace-code at all; material (`vat_tu`) batches don't.
- **Mã truy vết địa điểm (location trace code)**: `[AI code from LoaiDiaDiem] + GLN`.
- **Mã truy vết lô hàng (batch trace code)**: `GTIN + Số lô` (product batches only).
- **Self-generated GTIN/GLN** (when a business has no official GS1 registration):
  `200 + <13-digit business code> + <4-digit sequence> + <mod-10 check digit>`.

`CounterService` (`common/counter`) provides atomic `$inc`-based sequence generation for all of the
above (avoids race conditions that a "count existing documents" approach would have). Always reuse
it for anything requiring a per-tenant/per-day sequence rather than inventing a new counting scheme.

### Soft vs. hard delete

Entities that can have already-issued/distributed QR codes (**Sản phẩm, Lô hàng, Vùng sản xuất,
Nhà xưởng**) are never hard-deleted — only toggled between active/inactive status
(`ngung-kinh-doanh`/`mo-ban-lai`, etc.), so a printed QR code never points to a vanished record.
Pure catalog entities (`GoiDichVu`, `LoaiLoHang`, `LoaiKhoiLuong`, `LoaiSoLuong`, `VatTu`, `GiayTo`,
`DonViTrucThuoc`) do support real deletion, but check for in-use references in dependent
collections first (see e.g. `VungSanXuatService.remove()` checking `lo_hang` before allowing
deletion).

### File uploads (`modules/upload`)

Single generic `POST /upload?folder=<name>` endpoint (multer memory storage → AWS S3 SDK v3
pointed at a Cloudflare R2 endpoint) used by every module with an image/attachment field (Sản
phẩm, Vật tư, Vùng sản xuất, Nhà xưởng, DN/HTX/THT liên kết, Lô hàng, Nhật ký, Giấy tờ). Returns a
public URL built from `R2_PUBLIC_URL_BASE` (a `pub-*.r2.dev` bucket subdomain, not the R2 API
endpoint). Most modules cap `hinhAnh` at 3-5 images (`@ArrayMaxSize(...)`); Giấy tờ's
`fileDinhKem` is unlimited (accepts PDFs too). Lô hàng's `hinhAnh` is **not** client-uploaded — it
is auto-copied server-side from the assigned Sản phẩm/Vật tư's own images at creation time (see
`LoHangService.create()`).

### Ngành nghề / Công đoạn static taxonomy (`modules/nhat-ky-truy-xuat/nganh-nghe.constant.ts`)

Nhật ký truy xuất requires picking a Ngành nghề (industry) from a fixed list of 10 industries + a
"Khác" (other) catch-all, each with its own fixed ordered list of Công đoạn (process stage) names
(e.g. Trồng trọt → Chuẩn bị vùng sản xuất → ... → Phân phối). This is **hardcoded in code, not
DB-managed** — there is no System Admin screen to edit it (confirmed with the client, see
`cau-hoi-lam-ro-yeu-cau.md` Q8.2). `NhatKyTruyXuat.congDoanTen` just stores the final chosen
string — whether it came from the fixed list or was manually typed (every industry's stage
picker, and the whole "Khác" industry itself, allows free text) doesn't need to be distinguished
in the DB, only in the FE's rendering logic. **The identical constant is duplicated in
`admin-web/src/features/nhat-ky-truy-xuat/nganh-nghe.constant.ts`** — the two must be kept in sync
by hand if the list ever changes.

### Mongoose gotcha (v9)

Mongoose 9 split `Types.ObjectId` (the BSON value class) from `Schema.Types.ObjectId` (the actual
SchemaType). Every `@Prop({ type: ... })` for a ref field in this codebase uses
`Schema.Types.ObjectId` (imported as `MongooseSchema` — `import { Schema as MongooseSchema } from
'mongoose'`). Using the BSON `Types.ObjectId` class there instead compiles fine but silently breaks
`find()`/`populate()` by ID (queries return empty results with no error). If you add a new schema
with a ref field, copy the pattern from an existing schema rather than typing it from memory.

### Mongoose gotcha #2: `update()` must map `...Id` DTO fields to their schema ref names

Update DTOs name their fields after the raw ID they carry (`donViSanXuatId`, `vungSanXuatId`,
`nguoiPhuTrachId`, ...) while the schema's ref field has a different, shorter name
(`donViSanXuat`, `vungSanXuat`, `nguoiPhuTrach`, ...). Calling
`model.findOneAndUpdate(filter, dto)` with the raw DTO object does **not** error — Mongoose's
strict mode just silently drops any key that isn't a real schema path, so the update becomes a
no-op for that field. Every `update()` method in this codebase destructures the `...Id` fields out
of the DTO and re-adds them under the schema's actual field name before calling
`findOneAndUpdate` (see `VungSanXuatService.update()`, `VatTuService.update()`,
`LoHangService.update()`, `NhatKyTruyXuatService.update()` for the pattern). When adding a new
ref field to any module's update path, follow this mapping pattern — don't pass the DTO through
directly.

### Freemium / self-registration flow (Giai đoạn 1, new-requirement.md)

A business can now create its own account without a System Admin (`POST /auth/dang-ky` →
`DoanhNghiepService.dangKyTuDo()`): creates a `DoanhNghiep` in `CHO_KICH_HOAT` state plus its
first `admin_doanh_nghiep` account with a user-chosen password (`ThanhVienService.taoAdminTuDangKy()`,
unlike `taoAdminDauTien()`'s random temp password), and returns an immediate JWT via the same
`taoPhienDangNhap()` helper `login()` uses — no separate login step required after registering.

**Lock enforcement**: `common/tenant-status/doanh-nghiep-kich-hoat.guard.ts`
(`DoanhNghiepKichHoatGuard`) throws 403 for any non-system_admin, non-`HOAT_DONG` tenant. It is
applied to all 12 business modules (thanh-vien, don-vi-truc-thuoc, vung-san-xuat, nha-xuong-kho,
vat-tu, giay-to, san-pham, lo-hang, loai-lo-hang, loai-khoi-luong, loai-so-luong,
nhat-ky-truy-xuat) — **not** to `doanh-nghiep`, `goi-dich-vu`, `loai-dia-diem`, `auth`, or `upload`,
so a locked business can still see itself, browse/pick a service package, log in, and upload
during onboarding. `thanh-vien`'s `doiMatKhauCuaToi` and `nhat-ky-truy-xuat`'s public `layCongKhai`
are method-level exceptions within otherwise-locked controllers.

**NestJS DI gotcha**: a guard referenced via `@UseGuards(GuardClass)` does **not** resolve its
constructor dependencies through a `@Global()` module that merely exports it — Nest resolves guard
providers from the *consuming* module's own injector. `DoanhNghiepKichHoatGuard` must be listed in
each of the 12 modules' own `providers` array (not just imported via `TenantStatusModule`), and
each of those modules' `MongooseModule.forFeature([...])` must itself include
`{ name: DoanhNghiep.name, schema: DoanhNghiepSchema }` since that's what the guard's constructor
injects. Copy this pattern (providers + forFeature, not `imports: [TenantStatusModule]`) for any
future cross-cutting guard.

**Self-activation**: `GET /doanh-nghiep/toi` and `PATCH /doanh-nghiep/toi/kich-hoat` (both on
`DoanhNghiepController`, placed before the `:id` routes to avoid route shadowing) let a locked
Admin DN read its own record and pick any `GoiDichVu` to activate immediately —
`DoanhNghiepService.tuKichHoat()` requires `CHO_KICH_HOAT` status, then sets `trangThai =
HOAT_DONG` with a hardcoded `ngayKetThuc = now + 30 ngày` (`THOI_HAN_TU_KICH_HOAT_NGAY` constant;
there's no real payment gateway, so this always succeeds). `GoiDichVuController`'s `findAll`/
`findOne` also got method-level `@Roles` overrides so `admin_doanh_nghiep`/`quan_ly`/`nhan_vien`
can read (not just System Admin) — needed for the package-picker on the locked screen.

### Module structure

Each business entity is a self-contained Nest module under `src/modules/<name>/` with
`schemas/`, `dto/` (create/update/query), `<name>.service.ts`, `<name>.controller.ts`,
`<name>.module.ts`. New modules should follow this same shape and the tenant-scoping pattern above.

## Known deferred items (intentional, confirmed with client)

- **QR domain is a placeholder.** `SanPhamService.sinhMaQR()` and `LoHangService.sinhMaQR()` both
  build the QR content URL from `PUBLIC_TRACE_BASE_URL` (env var), falling back to
  `https://trace.example.com/...` if unset. There is no real public consumer-facing site yet in
  this repo or elsewhere, so scanning a generated QR code currently goes nowhere real. Swap in the
  real domain via `PUBLIC_TRACE_BASE_URL` once the public trace site exists — no code change
  needed elsewhere. Confirmed acceptable as a temporary state (`cau-hoi-lam-ro-yeu-cau.md` Q6.3).
- **`SanPham.luotQuet` (scan count) always reads 0.** The field exists and defaults to `0`, but
  nothing increments it — there's no scan-tracking endpoint because the public site that would call
  it doesn't exist yet. Wire up an increment (e.g. a public `POST /san-pham/:maTruyVetVatPham/quet`
  called by the future public site) once that site is built. Confirmed acceptable
  (`cau-hoi-lam-ro-yeu-cau.md` Q9.1).
- **Freemium/self-registration flow is now built** — see "Freemium / self-registration flow" above.
  This was explicitly deferred to last by the client (`cau-hoi-lam-ro-yeu-cau.md` Q1.1-Q1.3) and
  has now been implemented as the final item of `new-requirement.md`.
