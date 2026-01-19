# Content Model (current)

This doc is the working contract between:

- DB seed files (e.g. `db/content-seed-v5.sql`)
- Supabase tables (`pages`, `page_sections`, `content_items`, `site_sections`)
- Page loaders (`getStaticProps`)
- UI components (props-driven rendering)

**Important**: All pages use strict mode - missing required content will cause build to fail. All data must be seeded via `content-seed-v5.sql` before deployment.

## 1) Page content (route-scoped)

### Tables

- `pages`: one row per route (`/`, `/about`, etc.)
- `page_sections`: many rows per page, keyed by `section_key`

### Flow

`pages.route` → `pages.id` → `page_sections.page_id` → `page_sections.content (jsonb)` → component props

### Section keys (implemented)

#### `/` (home)

- `hero`
- `tagline`
- `learning-tools`
- `how-we-teach`
- `services`
- `pricing`
- `register-cta`
- `header`
- `footer`

#### `/about`

- `hero`
- `description`
- `tagline`
- `mission`
- `vision`
- `team-intro`
- `values-header`

#### `/platforms/student`

- `hero`
- `characters`
- `planets`
- `cta`

#### `/platforms/teacher`

- `hero`
- `tools`
- `lesson-modules`
- `benefits`
- `cta`

#### `/contact`

- `hero`
- `form` (includes `form_labels` object for all form field labels)
- `faq`

#### `/Auth/login`

- `selection` (platform selection page content)

#### `/Auth/register`

- `selection` (platform selection page content)

#### `/Auth/forgot-password`

- `form` (includes nested `form` and `success` objects)

#### `/Auth/reset-password`

- `form` (includes nested `form` and `success` objects)

#### `/Auth/register/teacher/pending`

- `content` (pending message content)

## 2) List content (typed collections)

### Table

- `content_items`: list-style content, scoped by `content_type`

### Content types used today

- `pricing` (home page pricing tiers)
- `pricing_plan` (pricing page plans)
- `service` (home page services)
- `learning_tool` (home page learning tools)
- `student_character` (student platform characters)
- `student_planet` (student platform planets)
- `teaching_tool` (teacher platform tools)
- `team_member` (about page team)
- `about_stat` (about page statistics)
- `core_value` (about page values)
- `lesson_module` (teacher platform modules)
- `teacher_benefit` (teacher platform benefits)
- `faq` (contact page FAQs)

### Important seed rule

`content_items.slug` should be stable and unique; the seed uses `ON CONFLICT (slug) DO UPDATE` so reruns update in place.

## 3) Header/Footer (current implementation)

Today, `header`/`footer` are stored in `site_sections` table and fetched via `getGlobalLayoutContent()` utility.

Notes:

- Header/Footer have no hardcoded copy fallbacks.
- Missing header/footer content will cause build to fail (strict mode).
- All pages fetch header/footer from `site_sections` during `getStaticProps`.

## 4) System sections (site_sections)

Global sections stored in `site_sections` table:

- `header` - Navigation and auth buttons
- `footer` - Footer links and copyright
- `404` - 404 error page content (title, message, home_link_text)
