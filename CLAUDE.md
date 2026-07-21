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
`doanhNghiep` field and **must** filter every query by it. The `doanhNghiepId` always comes from
the authenticated JWT payload via the `@CurrentUser()` decorator (see
`src/modules/auth/decorators/current-user.decorator.ts`) — **never** from a client-supplied
body/query field. Controllers pass `user.doanhNghiepId` into the service layer; services accept it
as an explicit first parameter (`create(doanhNghiepId, dto)`, `findAll(doanhNghiepId, query)`, etc.)
so tenant scoping is visible at every call site rather than hidden in a global context.

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
pointed at a Cloudflare R2 endpoint) used by both Sản phẩm images and Giấy tờ attachments. Returns
a public URL built from `R2_PUBLIC_URL_BASE` (a `pub-*.r2.dev` bucket subdomain, not the R2 API
endpoint). Sản phẩm is capped at 3 images (`@ArrayMaxSize(3)`); Giấy tờ attachments are unlimited.

### Mongoose gotcha (v9)

Mongoose 9 split `Types.ObjectId` (the BSON value class) from `Schema.Types.ObjectId` (the actual
SchemaType). Every `@Prop({ type: ... })` for a ref field in this codebase uses
`Schema.Types.ObjectId` (imported as `MongooseSchema` — `import { Schema as MongooseSchema } from
'mongoose'`). Using the BSON `Types.ObjectId` class there instead compiles fine but silently breaks
`find()`/`populate()` by ID (queries return empty results with no error). If you add a new schema
with a ref field, copy the pattern from an existing schema rather than typing it from memory.

### Module structure

Each business entity is a self-contained Nest module under `src/modules/<name>/` with
`schemas/`, `dto/` (create/update/query), `<name>.service.ts`, `<name>.controller.ts`,
`<name>.module.ts`. New modules should follow this same shape and the tenant-scoping pattern above.
