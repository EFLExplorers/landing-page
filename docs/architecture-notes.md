# Architecture Notes (landing site scope)

## Frontend
- Framework: Next.js (pages router), TypeScript, CSS Modules.
- Layout: `_app` wraps `Layout` → `Header` + `Footer`; `PageLayout` is a light wrapper for some pages.
- Routing: `/`, `/pricing`, `/about`, `/contact`, `/platforms/{teacher|student}`, `/courses`, auth under `/Auth/...`, system `/404`.
- State: mostly static/mock data in components; no global state manager observed.

## Data & Content
- Presentational data is hardcoded in components (cards, pricing tiers, modules, FAQs).
- No API calls in UI yet; consider moving display data to JSON/TS configs for reuse and future API swap.

## Auth/CTA Flow (current)
- Header auth links: `/Auth/login`, `/Auth/register`.
- CTAs often deep-link to `/Auth/register/{student|teacher}`; no runtime auth guard/redirect logic in UI.

## Testing
- Cypress e2e specs present for home, pricing, about, contact, student/teacher platforms.
- `data-cy` hooks available across components.

## Next Steps (tech backlog)
- Centralize CTA/link routing with role + auth-state awareness.
- Externalize content data (pricing tiers, cards, modules, FAQs) to config files.
- Add loading/empty/error patterns to sections once data-driven.
- Ensure accessibility on carousels and forms (focus, labels, ARIA, error text).
- Document environment/build/deploy steps when available.
