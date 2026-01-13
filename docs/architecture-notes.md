# Architecture Notes (landing site scope)

## Frontend
- Framework: Next.js (pages router), TypeScript, CSS Modules.
- Layout: `_app` wraps `Layout` → `Header` + `Footer`; `PageLayout` is a light wrapper for some pages.
- Routing: `/`, `/pricing`, `/about`, `/contact`, `/platforms/{teacher|student}`, `/courses`, auth under `/Auth/...`, system `/404`.
- State: primarily server-fetched content (SSG) + component props; no global state manager observed.

## Data & Content
- Supabase is the source of truth for landing/about marketing content.\n+  - Schema: `db/content-schema.sql`\n+  - Seed: `db/content-seed-v2.sql`\n+- Core tables:\n+  - `pages`: one row per route (e.g. `/`, `/about`).\n+  - `page_sections`: sections per page (by `section_key`) with `content` JSON.\n+  - `content_items`: list data (pricing tiers, services, learning tools, team members, etc.).\n+- Server-side data fetching:\n+  - `/` and `/about` fetch content via `getStaticProps` using `src/utils/supabaseClient`.\n+  - Shared section mapping helpers live in `src/utils/pageSectionMappers.ts`.\n+\n+### Strict content policy (current)\n+- `/` is strict: missing Supabase env or missing required seeded content causes SSG/build to fail.\n+- Header/Footer copy is no longer hardcoded; these components render only when content props are provided.\n+- Home \"How We Teach\" has no fallback cards; `page_sections.content.tabs` must be seeded.

## Auth/CTA Flow (current)
- Header auth links: `/Auth/login`, `/Auth/register`.
- CTAs often deep-link to `/Auth/register/{student|teacher}`; no runtime auth guard/redirect logic in UI.

## Testing
- Cypress e2e specs present for home, pricing, about, contact, student/teacher platforms.
- `data-cy` hooks available across components.

## Next Steps (tech backlog)
- Centralize CTA/link routing with role + auth-state awareness.
- Expand DB-driven coverage to the rest of the pages (pricing/contact/platforms) once schema/seed is ready.
- Add a documented \"content contract\" (section keys + JSON shapes) for editors and developers.
- Add consistent loading/empty/error patterns where client-fetch is introduced.
- Ensure accessibility on carousels and forms (focus, labels, ARIA, error text).
- Document environment/build/deploy steps when available.
