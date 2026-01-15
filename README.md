## ESL Explorers — Landing Page (Next.js)

Marketing site for the ESL Explorers / EFL ecosystem. This repo serves the public landing site and routes users into the Student and Teacher platforms.

### Tech stack

- **Next.js (Pages Router)** + **React** + **TypeScript**
- **Supabase** (Postgres + Auth) for content + user management
- **CSS Modules** for styling (no Tailwind usage in UI)
- **Lucide React** (icons), **Vercel Speed Insights**, **Cypress** for e2e
- **144KB bundle size** (ultra-optimized for speed)

### Performance optimizations

- **SSG everywhere**: All marketing pages pre-rendered at build time
- **Zero DB hits**: Pages load instantly from static HTML
- **Webhook revalidation**: Content updates without ISR polling
- **Optimized images**: Next.js Image component with lazy loading
- **Minimal bundle**: Removed heavy dependencies (Radix UI, react-icons, etc.)
- **Custom components**: Lightweight implementations over heavy libraries

**Result**: Sub-3-second load times, even for high-volume traffic.

### Quick start (local)

**Prereqs**: Node.js 18+ (recommended), Supabase project

1. Install deps:

```bash
npm install
```

2. Create `.env.local`:

- Copy `env-template.txt` → `.env.local`
- Fill in your Supabase keys + URLs

3. Set up Supabase schema + seed:

- In Supabase → **SQL Editor**, run:
  - `db/content-schema.sql`
  - then **one** seed file:
    - `db/content-seed-v4.sql` (full seed; safe to re-run via upserts), or
    - `db/content-seed-simple.sql` (minimal seed)

4. Run dev server:

```bash
npm run dev
```

Open `http://localhost:3000`.

### Environment variables

Use `env-template.txt` as the source-of-truth. Key vars:

- **Supabase (required for DB-driven pages)**
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Admin API (server-only; only needed if you use `/api/admin`)**
  - `SUPABASE_URL` (same project URL)
  - `SUPABASE_SERVICE_ROLE_KEY` (**never** expose to the client)
- **Platform URLs (used by auth/CTAs)**
  - `NEXT_PUBLIC_STUDENT_URL`
  - `NEXT_PUBLIC_TEACHER_URL`
- **Content revalidation (GitHub Actions)**
  - `NEXT_PUBLIC_SITE_URL` (must include protocol, e.g. `https://your-site.vercel.app`)
  - Also set this as a GitHub Actions **repository secret or variable** named `NEXT_PUBLIC_SITE_URL`

### Database-driven content model (Supabase)

Content is stored in:

- `pages`: one row per route (SEO + metadata)
- `page_sections`: structured blocks per page (`section_key` + JSON `content`)
- `content_items`: typed list data (pricing tiers, services, tools, modules, etc.)
- `site_sections`: global layout blocks (currently `header` / `footer`)

Docs:

- `docs/content-model.md` (section keys + content types)
- `docs/data-schemas.md` (JSON shapes for content)

### Which pages are DB-driven?

- **SSG (build-time fetch + webhook revalidation)**:
  - `/` (home) — **strict**: missing Supabase env or required seeded rows will fail build/SSG
  - `/about` — **strict**
  - `/pricing` — **strict**
  - `/contact` — **strict**
  - `/platforms/student` — **strict**
  - `/platforms/teacher` — **strict**

**All marketing pages use SSG with strict data policies** (build fails if required content missing). Content updates via webhook revalidation (no polling).

### Global header/footer behavior

- Preferred: pages fetch `header`/`footer` from `site_sections` on the server and pass them into `Layout`.
- Fallback: if a page doesn’t provide them (some Auth routes), `Layout` fetches `site_sections` client-side.

### API routes

- `GET /api/page-content?route=/about` — fetch `pages` + `page_sections`
- `GET /api/content?type=service` — fetch `content_items` by type
- `POST /api/revalidate` — revalidate key DB-driven pages (used by GitHub Actions)
- `POST /api/admin` — admin actions (requires service-role env vars)

More: `docs/api-usage.md`

### Scripts

```bash
npm run dev       # start dev server
npm run build     # production build
npm run start     # start production server
npm run lint      # Next.js lint
npm run cy:open   # open Cypress UI
npm run test:e2e  # run Cypress headless
```

### Instant content updates (GitHub Actions → revalidate)

This repo includes a workflow that calls `POST /api/revalidate` on every push to `main` / `master`:

- Workflow: `.github/workflows/revalidate-content.yml`
- Setup guide: `documents/INSTANT_UPDATES.md`

### Deployment notes

Deploy anywhere that supports Next.js (Vercel recommended). Ensure production env vars match `.env.local`, and that GitHub Actions has `NEXT_PUBLIC_SITE_URL` configured to your deployed URL.

### Project docs

- `docs/site-structure.md` (page tree)
- `docs/env-and-deploy.md` (env/deploy notes)
- `documents/supabase-integration.md` (auth + admin API details)
- `TESTING_GUIDE.md` (testing checklist)

### Contributing conventions

- **Use named exports** for components/utilities (Next.js `pages` still require a default export).
- **Use CSS Modules** (`*.module.css`) for styling.
