# Architecture Notes (landing site scope)

## Frontend

- Framework: Next.js (pages router), TypeScript, CSS Modules.
- Layout: `_app` wraps `Layout` → `Header` + `Footer`; `PageLayout` is a light wrapper for some pages.
- Routing: `/`, `/pricing`, `/about`, `/contact`, `/platforms/{teacher|student}`, auth under `/Auth/...`, system `/404`.
- State: primarily server-fetched content (SSG) + component props; `AuthContext` for user session management.
- Analytics: Vercel Analytics and Speed Insights integrated in `_app.tsx` for production monitoring.

## Data & Content

- Supabase is the source of truth for ALL content (marketing, auth, system pages).
  - Schema: `db/content-schema.sql`
  - Seed: `db/content-seed-v5.sql` (latest, includes all pages)
- Core tables:
  - `pages`: one row per route (e.g. `/`, `/about`, `/pricing`, `/platforms/student`, `/Auth/login`, etc.)
  - `page_sections`: sections per page (by `section_key`) with `content` JSON
  - `content_items`: list data (pricing tiers, services, learning tools, team members, pricing plans, FAQs, etc.)
  - `site_sections`: global sections like `header`, `footer`, `404`
- Data fetching:
  - SSG via `getStaticProps`: ALL pages (marketing, auth, system)
  - No SSR pages - all content is pre-rendered at build time

### Global layout (header/footer) behavior (current)

- All pages fetch `headerContent` / `footerContent` from `site_sections` during `getStaticProps`.
- No client-side fallback - missing header/footer content causes build to fail.

### Strict content policy (current)

- **ALL pages are strict**: missing Supabase env or missing required seeded content causes SSG/build to fail.
- **No fallback defaults**: All content must be seeded via `content-seed-v5.sql` before build.
- **Zero tolerance**: Missing any required field (title, description, content, etc.) will throw an error during build.
- This ensures data integrity and prevents incomplete deployments.

## Performance notes (current)

- Supabase queries avoid `select("*")` to reduce payload size.
- Pages/components pass smaller, UI-focused DTOs instead of large DB row objects where possible.

## Auth System Architecture

### Authentication Context (`AuthContext`)
- **Location**: `src/contexts/authContext.tsx`
- **Provider**: Wraps app in `_app.tsx` to provide global auth state
- **Features**:
  - User session management via Supabase Auth
  - User role tracking (`student` | `teacher` | `null`) from `users` table
  - Session timeout: 2-hour inactivity timeout with 5-minute warning
  - Activity tracking: Monitors mouse, keyboard, scroll, and touch events
  - Auto sign-out on session expiry
  - Real-time auth state changes via Supabase listeners

### Auth Components Structure
- **Core Components** (`src/components/auth/`):
  - `AuthForm.tsx` - Base auth form wrapper
  - `AuthModal.tsx` - Modal container for auth flows
  - `LoginForm.tsx` / `RegistrationForm.tsx` - Role-specific forms
  - `AuthContainer.tsx` - Layout wrapper for auth pages
- **Shared Components** (`src/components/auth/shared/`):
  - `FormInput.tsx` - Reusable form input component
  - `PasswordInput.tsx` - Password field with visibility toggle
  - `PasswordStrength.tsx` - Password strength indicator
  - `LoadingSpinner.tsx` - Loading state indicator
- **Utilities**:
  - `authValidation.ts` - Form validation utilities
  - `authHelpers.ts` - Helper functions for auth operations
- **Types**: `auth.types.ts` - TypeScript interfaces for auth data

### Auth Flow
- Header auth links: `/Auth/login`, `/Auth/register`.
- Selection pages route to role-specific forms: `/Auth/login/{student|teacher}`, `/Auth/register/{student|teacher}`
- Password recovery: `/Auth/forgot-password` → `/Auth/reset-password`
- Teacher registration: Includes pending state at `/Auth/register/teacher/pending`
- CTAs often deep-link to `/Auth/register/{student|teacher}`; no runtime auth guard/redirect logic in UI.

## Testing

- Cypress e2e specs present for home, pricing, about, contact, student/teacher platforms.
- `data-cy` hooks available across components.

## Completed (as of latest update)

- ✅ All pages are DB-driven (marketing, auth, system pages)
- ✅ Teacher platform fully migrated to DB
- ✅ Auth pages fully migrated to DB (login, register, forgot/reset password, pending)
- ✅ 404 page migrated to DB (via site_sections)
- ✅ Contact form labels migrated to DB
- ✅ Strict mode enabled everywhere - no fallbacks
- ✅ All content seeded in `content-seed-v5.sql`

## Next Steps (tech backlog)

- Centralize CTA/link routing with role + auth-state awareness.
- Add a documented \"content contract\" (section keys + JSON shapes) for editors and developers.
- Ensure accessibility on carousels and forms (focus, labels, ARIA, error text).
