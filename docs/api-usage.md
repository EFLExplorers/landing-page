# UI ↔ API / DB Usage

Current state: ALL pages fetch directly from Supabase during `getStaticProps` (SSG). No SSR pages.

- Page content: `pages` + `page_sections`
- List content: `content_items`
- Global content: `site_sections` (header, footer, 404)

**Strict mode**: ALL pages are strict - missing required Supabase env/seeded content fails build/SSG. No fallback defaults.

## Current Data Dependencies (by page)

**All pages are DB-driven with strict validation:**

- Home (`/`)
  - `pages` + `page_sections` for section copy
  - `content_items` for `pricing`, `service`, `learning_tool`
- Pricing (`/pricing`)
  - `pages` + `page_sections` for header/footer copy blocks
  - `content_items` for `pricing_plan`
- About (`/about`)
  - `pages` + `page_sections` for copy blocks
  - `content_items` for `team_member`, `about_stat`, `core_value`
- Contact (`/contact`)
  - `pages` + `page_sections` for hero/form (with form_labels)/faq
  - `content_items` for `faq` (question/answer)
- Teacher platform (`/platforms/teacher`)
  - `pages` + `page_sections` for hero/tools/lesson-modules/benefits/cta
  - `content_items` for `teaching_tool`, `lesson_module`, `teacher_benefit`
- Student platform (`/platforms/student`)
  - `pages` + `page_sections` for hero/characters/planets/cta copy
  - `content_items` for `student_character`, `student_planet`
- Auth pages (`/Auth/*`)
  - `pages` + `page_sections` for all auth page content (selection, forms, success states, pending messages)
- 404 (`/404`)
  - `site_sections` for error page content

## Current API endpoints

- `GET /api/page-content?route=/about`
  - Returns `{ id, route, title, meta_description, sections: PageSection[] }`
  - Backed by `pages` + `page_sections`.

- `GET /api/content?type=service`
  - Returns `ContentItem[]` filtered by `content_type` (e.g. `pricing`, `service`, `learning_tool`).
  - Backed by `content_items`.

## Build-Time Validation

- All pages use `getStaticProps` (SSG) - no SSR pages.
- Missing required content throws errors during build - no runtime fallbacks.
- All content must be seeded via `content-seed-v5.sql` before build.

## Client Integration Notes

- No loading/empty states needed - all content is validated at build time.
- All pages are pre-rendered as static HTML.
- Normalize CTA handling: central helper that resolves target based on role + auth state (future work).
- Keep `data-cy` hooks stable for Cypress testing.
