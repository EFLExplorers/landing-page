# Testing Coverage (current vs planned)

## Current (per Cypress specs observed)

- Home: hero, nav, core sections
- Pricing: pricing table render
- About: page render
- Contact: page render
- Student platform: page render
- Teacher platform: page render

## Gaps / To Add

- CTA flows:
  - Header/login/register links
  - Pricing CTAs (Basic/Premium → student register, Enterprise → contact)
  - Hero/register CTAs on home, teacher, student pages
- Forms:
  - Contact form validation (required fields, email format)
  - Success/error handling (stub API)
  - Auth forms (forgot/reset password)
- Dynamic controls:
  - Student planets carousel: prev/next, click planet, start/stop spin
  - Lesson modules: card select updates detail panel
- Accessibility basics:
  - Focus states on nav/buttons
  - ARIA labels on carousel buttons
- Auth pages:
  - Login/register selection flows
  - Password reset flow
  - Teacher pending page

## Note on Data-Driven Testing

- All content is validated at build time (strict mode)
- No need to test loading/empty states - build fails if content missing
- Focus testing on user interactions and UI behavior

## Testing Hooks

- Keep `data-cy` attributes stable; add where missing on new CTAs/components.

## Next Steps

- Expand e2e specs to cover gaps above.
- Add lightweight unit/interaction tests for CTA resolver once implemented.
