## EFL Explorers — Landing Page (Next.js)

Marketing site for the EFL Explorers / EFL ecosystem. This repo serves the public landing site and routes users into the Student and Teacher platforms.

### Tech stack

- **Next.js (Pages Router)** + **React** + **TypeScript**
- **Supabase** (Postgres + Auth) for content + user management
- **CSS Modules** for styling (component-scoped styles with custom utility classes)
- **Lucide React** (icons), **Vercel Speed Insights**, **Vercel Analytics**, **Cypress** for e2e
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
  - then `db/content-seed-v5.sql` (complete seed with all pages - **required**)
  
**Important**: The build will fail if required content is not seeded. All pages use strict mode with no fallbacks.

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

**ALL pages are DB-driven with strict mode** (build fails if required content missing):

- **Marketing pages** (SSG):
  - `/` (home)
  - `/about`
  - `/pricing`
  - `/contact` (includes DB-driven form labels)
  - `/platforms/student`
  - `/platforms/teacher`
  
- **Auth pages** (SSG):
  - `/Auth/login` (selection page)
  - `/Auth/register` (selection page)
  - `/Auth/forgot-password` (form + success states)
  - `/Auth/reset-password` (form + success states)
  - `/Auth/register/teacher/pending` (pending message)

- **System pages** (SSG):
  - `/404` (error page content from site_sections)

**Strict mode**: Missing Supabase env vars or required seeded content will cause build/SSG to fail. No fallback defaults - all content must be seeded via `content-seed-v5.sql`.

### Global header/footer behavior

- Preferred: pages fetch `header`/`footer` from `site_sections` on the server and pass them into `Layout`.
- Fallback: if a page doesn’t provide them (some Auth routes), `Layout` fetches `site_sections` client-side.

### API routes

- `GET /api/page-content?route=/about` — fetch `pages` + `page_sections`
- `GET /api/content?type=service` — fetch `content_items` by type
- `POST /api/revalidate` — revalidate key DB-driven pages (used by GitHub Actions)

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
- **Strict mode**: All pages must validate required content and throw errors if missing - no fallback defaults.
- **Database-first**: All content must be seeded in `content-seed-v5.sql` before deployment.
