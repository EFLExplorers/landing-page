# CTA Routing Rules (planned)

Centralize CTA destinations based on role and auth state to avoid drift across components.

## Roles

- `student`
- `teacher`
- `admin` (if applicable)

## States

- `unauthenticated`
- `authenticated`
- `pending_verification` (email/account)
- `authenticated_but_incomplete_profile` (optional)

## Rules (example defaults)

- Hero/Register CTAs:
  - Unauth: `/Auth/register/{role}`
  - Pending verification: `/Auth/register/{role}/pending` or verification prompt
  - Authenticated: redirect to dashboard (`/dashboard/{role}`) or target page
- Login links:
  - Always `/Auth/login/{role}`; if already authed, redirect to dashboard
- Pricing CTAs:
  - Student plans → `/Auth/register/student` (unauth) else dashboard/plan-upgrade
  - Teacher/School plans → `/Auth/register/teacher` (unauth) else dashboard/plan-management
- Contact/Enterprise CTAs:
  - Always `/contact` (or mailto) regardless of auth
- Footer/Header Register:
  - Use same resolver as hero to keep consistent behavior

## Helper Contract (proposed)

- `resolveCta({ role, userState, intent }) -> { href, requireAuth?: boolean }`
  - `role`: `student | teacher | admin | null`
  - `userState`: `unauthenticated | authenticated | pending_verification | incomplete_profile`
  - `intent`: `register | login | pricing | hero | cta | upgrade`
- Keep mapping in one place (TS config) and re-use in components.

## Next Steps

- Implement helper in `src/lib/ctaResolver.ts`.
- Update UI CTAs to call the helper.
- Add tests to assert outputs for key combinations.
