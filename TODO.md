# Portfolio AI Pro — Phase 0 Stack Reconciliation TODO

## Decisions (confirmed)
- Accept Next.js 13.4.13 / React 18.2.0 (no upgrade)
- Add shadcn/ui core primitives (Button, Input, Card, Dialog, Toast)
- Keep hand-rolled auth + bolt on Google OAuth manually
- Add Cloudinary for image & resume PDF uploads

## Steps
- [x] 1. Install shadcn/ui deps (tailwind-merge, class-variance-authority, radix dialog/label, lucide)
- [x] 2. Create `lib/utils.ts` (cn helper)
- [x] 3. Create `components.json` (shadcn config)
- [x] 4. Create shadcn/ui primitives: Button, Input, Card, Dialog, Toast
- [x] 5. Create `lib/google.ts` (OAuth URL, token exchange, user info)
- [x] 6. Create `lib/session.ts` (shared session creation helper)
- [x] 7. Create Google OAuth API routes (`/api/auth/google`, `/api/auth/google/callback`)
- [x] 8. Add "Continue with Google" button to login & register pages
- [x] 9. Create `lib/cloudinary.ts` (upload helper + transform)
- [x] 10. Create `/api/upload` route + `ImageUploader` component
- [x] 11. Wire Cloudinary into portfolio builder (feature section images) & ProfileCard (profile photo)
- [x] 12. Wire ToastProvider into root layout
- [x] 13. Update README to reflect actual stack
- [ ] 14. Run typecheck, lint, test, build
</content>
