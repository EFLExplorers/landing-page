# Data Sourcing & Scaling Plan

Goal: reduce duplicated/hardcoded text/objects, centralize data in DB/config, and keep the UI lean.

## Hardcoded Content to Externalize

- Home: learning tools cards; services cards; pricing teaser tiers.
- Pricing page: plans, features, CTAs.
- About: stats, mission/vision/values copy, team members.
- Contact: contact info; FAQs.
- Teacher platform: teaching tools; lesson modules; benefits; CTA.
- Student platform: characters; planets; CTA.
- Courses: placeholder → course catalog.
- Auth/CTA: role-based redirect rules and target URLs.

## Suggested Storage Model

- Current tables (implemented):
  - `pages` (one row per route, e.g. `/`, `/about`)
  - `page_sections` (sections per page by `section_key`, with `content` JSON)
  - `content_items` (typed list data: `pricing`, `service`, `learning_tool`, `team_member`, `about_stat`, `core_value`, etc.)
- Seed (implemented):
  - `db/content-seed-v2.sql` seeds routes, sections, and list content.
  - Seed reruns are safe for `content_items` via stable `slug` + `ON CONFLICT (slug) DO UPDATE`.

## What is DB-driven today

- `/`:
  - `pages` + `page_sections` for section copy and header/footer sections
  - `content_items` for pricing tiers, services, learning tools
  - strict mode: missing env/seeded content fails build/SSG
- `/about`:
  - `pages` + `page_sections` for copy blocks
  - `content_items` for team members/stats/core values
- `/contact`:
  - `pages` + `page_sections` for hero/form/faq header copy
  - `content_items` for FAQs
  - SSR: uses `getServerSideProps`
- `/pricing`:
  - `pages` + `page_sections` for `pricing-header` / `pricing-footer`
  - `content_items` for `pricing_plan`
- `/platforms/student`:
  - `pages` + `page_sections` for hero/characters/planets/cta
  - `content_items` for `student_character` / `student_planet`

## Cleanup & De-duplication

- Move repeated CTAs (register links) to a single resolver helper.
- Standardize pricing copy (teaser vs pricing page) from one source.
- Centralize icon references instead of inline emoji where possible.

## Loading/Empty/Error Patterns

- Each dynamic section should render: loading skeleton, empty-state message, and error retry.
- Keep layout stable (fixed card counts with placeholders) to avoid content shift.

## Steps to Implement

- Continue migrating remaining pages (teacher platform, courses, auth pages) to DB-driven props (if desired).
- Keep content contracts (section keys + JSON shapes) documented and versioned with the seed.
- Add a CTA resolver utility with role + auth-state inputs.
- Add tests to ensure sections render from provided data and handle empty/error cases.
