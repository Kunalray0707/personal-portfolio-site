# Phase 8 — Export & Deployment Implementation TODO

## Steps
- [x] 1. Update Prisma schema with `CustomDomain` model + relations on Portfolio/User
- [x] 2. Run `prisma generate`
- [x] 3. Install `archiver` + `@types/archiver`
- [x] 4. Create `lib/export.ts` (standalone HTML, JSON, Vercel manifest, GitHub metadata)
- [x] 5. Create `lib/domains.ts` (normalize, validate, token verify helpers)
- [x] 6. Create export API routes:
  - [x] `/api/export/html`
  - [x] `/api/export/json`
  - [x] `/api/export/pdf`
  - [x] `/api/export/zip`
  - [x] `/api/export/deploy`
  - [x] `/api/export/github`
- [x] 7. Create custom domain API routes:
  - [x] `/api/domains/set`
  - [x] `/api/domains/verify`
  - [x] `/api/domains/list`
  - [x] `/api/domains/delete`
- [x] 8. Create `components/payments/ExportPanel.tsx`
- [x] 9. Create `/dashboard/export` page
- [x] 10. Add Export link to Sidebar
- [x] 11. Create `tests/export.test.ts`
- [ ] 12. Run typecheck, lint, test, build
- [x] 13. Update README with Phase 8 docs
