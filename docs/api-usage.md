# UI ↔ API / DB Usage

Current state: the app has Supabase-backed content APIs and key pages fetch directly from Supabase during `getStaticProps` (or `getServerSideProps` for `/contact`).

- Page content: `pages` + `page_sections`
- List content: `content_items`

Note: `/` is strict (missing required Supabase env/seeded content fails build/SSG).

## Current Data Dependencies (by page)

- Home
  - `pages` + `page_sections` for section copy
  - `content_items` for `pricing`, `service`, `learning_tool`
- Pricing
  - `pages` + `page_sections` for header/footer copy blocks
  - `content_items` for `pricing_plan`
- About
  - `pages` + `page_sections` for copy blocks
  - `content_items` for `team_member`, `about_stat`, `core_value`
- Contact
  - `pages` + `page_sections` for hero/form/faq header copy
  - `content_items` for `faq` (question/answer)
- Teacher platform
  - Static component content (not DB-driven yet)
- Student platform
  - `pages` + `page_sections` for hero/characters/planets/cta copy
  - `content_items` for `student_character`, `student_planet`
- Courses
  - Course catalog (placeholder today)
- Auth/CTA
  - Static routes; CTAs link to `/Auth/...`

## Current API endpoints

- `GET /api/page-content?route=/about`
  - Returns `{ id, route, title, meta_description, sections: PageSection[] }`
  - Backed by `pages` + `page_sections`.

- `GET /api/content?type=service`
  - Returns `ContentItem[]` filtered by `content_type` (e.g. `pricing`, `service`, `learning_tool`).
  - Backed by `content_items`.

## Client Integration Notes

- Add loading/empty/error states to all dynamic sections.
- Prefer server-side fetching (`getStaticProps`) for marketing pages unless you intentionally need runtime updates.
- Normalize CTA handling: central helper that resolves target based on role + auth state.
- Keep `data-cy` hooks stable after data becomes dynamic.
