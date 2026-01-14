# Environment & Deploy (stub)

Document env vars and deployment steps as they become defined.

## Env Vars

- **Supabase (required)**
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Platform URLs**
  - `NEXT_PUBLIC_STUDENT_URL`
  - `NEXT_PUBLIC_TEACHER_URL`
- **Revalidation**
  - `NEXT_PUBLIC_SITE_URL` (used by GitHub Action to call `/api/revalidate`)
    - Set as a **GitHub Actions repository secret or repository variable** named `NEXT_PUBLIC_SITE_URL`
    - Value must include protocol, e.g. `https://your-project.vercel.app`
    - If you set this as a **GitHub Actions Environment** variable/secret, the workflow job must target that environment or it will not be available at runtime.

## Local

- Install: `npm install`
- Dev: `npm run dev`
- Tests: `npm run cypress` (or `npx cypress open`) — confirm scripts

## Build/Deploy

- Build: `npm run build`
- Start: `npm start` (if used)
- Hosting: (fill in) Vercel/other; include any required secrets

### Windows PowerShell note

Some PowerShell versions don't support `&&` as a command separator. Use:

```powershell
npm run build; if ($LASTEXITCODE -eq 0) { npm start }
```

## Database seeding (Supabase)

For a new or empty Supabase project, run these in the Supabase SQL editor:

1. `db/content-schema.sql`
2. `db/content-seed-v3.sql` (safe to re-run; uses upserts)

> Note: the home page (`/`) is strict and will fail SSG/build if required seeded rows are missing.

## Notes

- Add env-template entries as vars are introduced.
- Keep secrets out of the repo; use env files or platform secret stores.
