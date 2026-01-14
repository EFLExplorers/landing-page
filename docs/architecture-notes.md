# Architecture Notes (landing site scope)

## Frontend

- Framework: Next.js (pages router), TypeScript, CSS Modules.
- Layout: `_app` wraps `Layout` → `Header` + `Footer`; `PageLayout` is a light wrapper for some pages.
- Routing: `/`, `/pricing`, `/about`, `/contact`, `/platforms/{teacher|student}`, `/courses`, auth under `/Auth/...`, system `/404`.
- State: primarily server-fetched content (SSG) + component props; no global state manager observed.

## Data & Content

- Supabase is the source of truth for marketing content.
  - Schema: `db/content-schema.sql`
  - Seed: `db/content-seed-v3.sql` (currently a snapshot copy of v2)
- Core tables:
  - `pages`: one row per route (e.g. `/`, `/about`, `/pricing`, `/platforms/student`)
  - `page_sections`: sections per page (by `section_key`) with `content` JSON
  - `content_items`: list data (pricing tiers, services, learning tools, team members, pricing plans, FAQs, etc.)
  - `site_sections`: global sections like `header` / `footer`
- Data fetching:
  - SSG via `getStaticProps`: `/`, `/about`, `/pricing`, `/platforms/student`
  - SSR via `getServerSideProps`: `/contact`

### Global layout (header/footer) behavior (current)

- Primary path: pages provide `headerContent` / `footerContent` via props (server-fetched from `site_sections`).
- Fallback: if a page does not provide global content (notably some Auth routes using `.../page.tsx` naming), `Layout` fetches from `site_sections` on the client.

### Strict content policy (current)

- `/` is strict: missing Supabase env or missing required seeded content causes SSG/build to fail.
- Header/Footer copy is no longer hardcoded; these components render only when content is loaded from `site_sections`.
- Home "How We Teach" has no fallback cards; `page_sections.content.tabs` must be seeded.

## Performance notes (current)

- Supabase queries avoid `select("*")` to reduce payload size.
- Pages/components pass smaller, UI-focused DTOs instead of large DB row objects where possible.

## Auth/CTA Flow (current)

- Header auth links: `/Auth/login`, `/Auth/register`.
- CTAs often deep-link to `/Auth/register/{student|teacher}`; no runtime auth guard/redirect logic in UI.

## Testing

- Cypress e2e specs present for home, pricing, about, contact, student/teacher platforms.
- `data-cy` hooks available across components.

## Next Steps (tech backlog)

- Centralize CTA/link routing with role + auth-state awareness.
- Expand DB-driven coverage to the remaining pages (teacher platform, auth pages, courses) once schema/seed is ready.
- Add a documented \"content contract\" (section keys + JSON shapes) for editors and developers.
- Add consistent loading/empty/error patterns where client-fetch is introduced.
- Ensure accessibility on carousels and forms (focus, labels, ARIA, error text).
- Document environment/build/deploy steps when available.
