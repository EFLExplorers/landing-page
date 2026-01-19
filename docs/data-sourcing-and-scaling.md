# Data Sourcing & Scaling Plan

Goal: reduce duplicated/hardcoded text/objects, centralize data in DB/config, and keep the UI lean.

## Content Status (Current)

✅ **All content is DB-driven** - No hardcoded content remains:

- ✅ Home: learning tools cards; services cards; pricing teaser tiers.
- ✅ Pricing page: plans, features, CTAs.
- ✅ About: stats, mission/vision/values copy, team members.
- ✅ Contact: contact info; FAQs; form labels.
- ✅ Teacher platform: teaching tools; lesson modules; benefits; CTA.
- ✅ Student platform: characters; planets; CTA.
- ✅ Auth pages: all text, labels, messages, success states.
- ✅ 404 page: title, message, link text.
- ⏳ Courses: placeholder → course catalog (future work).

## Storage Model (Current Implementation)

- Tables (all implemented):
  - `pages` (one row per route, e.g. `/`, `/about`, `/Auth/login`, etc.)
  - `page_sections` (sections per page by `section_key`, with `content` JSON)
  - `content_items` (typed list data: `pricing`, `service`, `learning_tool`, `team_member`, `about_stat`, `core_value`, `teaching_tool`, `lesson_module`, `teacher_benefit`, `faq`, etc.)
  - `site_sections` (global sections: `header`, `footer`, `404`)
- Seed (current):
  - `db/content-seed-v5.sql` - Complete seed with all pages, sections, and content items.
  - Seed reruns are safe via `ON CONFLICT` clauses (upserts).
  - **Required before build**: All content must be seeded or build will fail.

## What is DB-driven (Complete List)

**All pages are DB-driven with strict mode** (build fails if content missing):

- `/` (home):
  - `pages` + `page_sections` for section copy
  - `content_items` for pricing tiers, services, learning tools
- `/about`:
  - `pages` + `page_sections` for copy blocks
  - `content_items` for team members/stats/core values
- `/contact`:
  - `pages` + `page_sections` for hero/form (with form_labels)/faq
  - `content_items` for FAQs
- `/pricing`:
  - `pages` + `page_sections` for `pricing-header` / `pricing-footer`
  - `content_items` for `pricing_plan`
- `/platforms/student`:
  - `pages` + `page_sections` for hero/characters/planets/cta
  - `content_items` for `student_character` / `student_planet`
- `/platforms/teacher`:
  - `pages` + `page_sections` for hero/tools/lesson-modules/benefits/cta
  - `content_items` for `teaching_tool` / `lesson_module` / `teacher_benefit`
- `/Auth/login`:
  - `pages` + `page_sections` for selection page content
- `/Auth/register`:
  - `pages` + `page_sections` for selection page content
- `/Auth/forgot-password`:
  - `pages` + `page_sections` for form and success states
- `/Auth/reset-password`:
  - `pages` + `page_sections` for form and success states
- `/Auth/register/teacher/pending`:
  - `pages` + `page_sections` for pending message content
- `/404`:
  - `site_sections` for error page content

## Strict Mode Policy

- **No fallbacks**: All pages throw errors if required content is missing.
- **Build-time validation**: Missing data causes build to fail immediately.
- **Data integrity**: Ensures all content is properly seeded before deployment.
- **Clean codebase**: No bloated fallback code - just strict validation.

## Content Contracts

- Section keys and JSON shapes are documented in `docs/content-model.md` and `docs/data-schemas.md`.
- Seed file (`content-seed-v5.sql`) serves as the source of truth for content structure.
- All content must match the expected schema or build will fail.

## Future Work

- Centralize CTA/link routing with role + auth-state awareness.
- Courses page: migrate to DB-driven when ready.
- Add tests to ensure sections render from provided data (build-time validation already covers this).
