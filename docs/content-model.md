# Content Model (current)

This doc is the working contract between:
- DB seed files (e.g. `db/content-seed-v2.sql`)
- Supabase tables (`pages`, `page_sections`, `content_items`)
- Page loaders (`getStaticProps`)
- UI components (props-driven rendering)

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

## 2) List content (typed collections)

### Table
- `content_items`: list-style content, scoped by `content_type`

### Content types used today
- `pricing`
- `service`
- `learning_tool`
- `team_member`
- `about_stat`
- `core_value`

### Important seed rule
`content_items.slug` should be stable and unique; `db/content-seed-v2.sql` uses `ON CONFLICT (slug) DO UPDATE` so reruns update in place.

## 3) Header/Footer (current implementation)

Today, `header`/`footer` are stored as `page_sections` on `/` and mapped into `headerContent` / `footerContent` props for the shared `Layout`.

Notes:
- Header/Footer have no hardcoded copy fallbacks.
- If no props are provided, those elements render nothing.

