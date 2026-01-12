## Supabase Tables and Schema (Current Needs)

This document describes the minimum schema needed in Supabase for the app as currently implemented.

### 1. Auth Users (Supabase built-in)

Supabase manages an internal `auth.users` table when using email/password sign up.

- You do **not** need to create this manually.
- ID from `auth.users` is used as the primary key in the app's `users` table.

Key fields we rely on from auth:

- `id` (UUID) – primary identifier, used as `users.id`.
- `email` (text).
- Optional user metadata fields set at sign-up:
  - `first_name`
  - `last_name`
  - `role` (`"student"`, `"teacher"`, or `"admin"`).

### 2. `users` Table

Used heavily throughout the app to track profiles and roles.

**Suggested structure:**

- `id` (uuid, primary key) – references `auth.users.id`.
- `email` (text, unique, not null).
- `first_name` (text).
- `last_name` (text).
- `role` (text, not null):
  - expected values: `"student"`, `"teacher"`, `"admin"`.
- `approved` (boolean, not null, default `false`):
  - `true` for students by default.
  - `false` for teachers until an admin approves them.
- `created_at` (timestamp with time zone, default `now()`).
- `updated_at` (timestamp with time zone, default `now()` or maintained via trigger).

**Usage in code:**

- Registration (`RegistrationForm.tsx`): inserts a row after `signUp`.
- Login (`LoginForm.tsx`): reads `role, approved` for the logged-in user.
- Auth context (`authContext.tsx`): reads `role` by `id`.
- Admin login + APIs: checks `role` equals `"admin"`.

### 3. `teachers` Table

Used by the admin API for approving teachers.

**Suggested structure:**

- `id` (uuid, primary key) – can reference `auth.users.id` or be standalone.
- `user_id` (uuid, nullable if `id` is the reference) – reference to `users.id` (recommended).
- `email` (text, unique, not null).
- `approved` (boolean, not null, default `false`).
- `created_at` (timestamp with time zone, default `now()`).
- `updated_at` (timestamp with time zone, default `now()`).

**Usage in code:**

- Admin API (`src/pages/api/admin.ts`):
  - On `action === "approve-teacher"` and given `emailToApprove`, runs:
    - `from("teachers").update({ approved: true }).eq("email", emailToApprove)`.

### 4. RLS (Row Level Security) Suggestions

When you enable RLS, define policies to keep data secure:

#### `users` table policies

- Allow **logged-in users** to read their own row.
- Allow **logged-in users** to update their own basic profile fields (e.g., names) if desired.
- Restrict `role` and `approved` changes to **service role / admin logic** only.

#### `teachers` table policies

- Allow **logged-in teachers** to read their own teacher record.
- Updates to `approved` should only be done:
  - by the **service role key** (via the admin API route), or
  - by a stored procedure invoked with service role.

### 5. Example SQL (PostgreSQL) – Optional Starting Point

```sql
-- users table
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  first_name text,
  last_name text,
  role text not null check (role in ('student', 'teacher', 'admin')),
  approved boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- teachers table
create table if not exists public.teachers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  email text not null unique,
  approved boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

You can adapt these definitions to match any additional requirements (e.g., school associations, subjects taught, etc.).

## Content Management Tables (Database-Driven Marketing Content)

The app now uses a comprehensive content management system where marketing content is stored in the database rather than hardcoded in components. This enables dynamic content updates without code changes.

### 4. `pages` Table

Stores metadata for route-based pages used in SEO and content management.

**Structure:**
- `id` (uuid, primary key) – unique identifier for each page
- `route` (text, unique, not null) – URL path (e.g., '/', '/about', '/contact')
- `title` (text) – page title for SEO
- `meta_description` (text) – meta description for SEO
- `created_at` (timestamp with time zone, default `now()`)
- `updated_at` (timestamp with time zone, default `now()`)

**Usage:**
- API route `src/pages/api/page-content.ts` fetches page data by route
- Used in `getStaticProps` for page metadata and SEO

### 5. `page_sections` Table

Stores structured content blocks within pages, enabling flexible content management.

**Structure:**
- `id` (uuid, primary key)
- `page_id` (uuid, not null) – references `pages.id`
- `section_key` (text, not null) – identifier for the section (e.g., 'hero', 'tagline', 'mission')
- `section_type` (text, not null, default 'rich-text') – content type classification
- `heading` (text) – main heading for the section
- `subheading` (text) – secondary heading/subtitle
- `body` (text) – main content text
- `image_url` (text) – optional image path
- `cta_label` (text) – call-to-action button text
- `cta_href` (text) – call-to-action link URL
- `sort_order` (integer, not null, default 0) – display order
- `active` (boolean, not null, default true) – content visibility toggle
- `data` (jsonb, not null, default '{}') – flexible additional data (icons, buttons, etc.)
- `created_at` (timestamp with time zone, default `now()`)
- `updated_at` (timestamp with time zone, default `now()`)

**Usage:**
- API route `src/pages/api/page-content.ts` fetches sections for a page
- Components receive section data as props for dynamic rendering
- Supports complex content structures via the `data` JSONB field

### 6. `pricing_tiers` Table

Manages pricing information for the pricing section.

**Structure:**
- `id` (uuid, primary key)
- `name` (text, not null) – plan name (e.g., "Free Access", "Individual")
- `price` (text, not null) – price display (e.g., "Free", "$20")
- `period` (text, not null, default '') – billing period (e.g., "/MO", "/year")
- `description` (text, not null) – plan description
- `is_featured` (boolean, not null, default false) – highlights featured plans
- `sort_order` (integer, not null, default 0) – display order
- `active` (boolean, not null, default true) – plan visibility
- `created_at` (timestamp with time zone, default `now()`)
- `updated_at` (timestamp with time zone, default `now()`)

### 7. `services` Table

Manages service offerings displayed on the home page.

**Structure:**
- `id` (uuid, primary key)
- `title` (text, not null) – service name
- `description` (text, not null) – service description
- `icon` (text, not null) – emoji or icon identifier
- `background_icons` (jsonb, not null, default '[]') – array of background icon strings
- `sort_order` (integer, not null, default 0) – display order
- `active` (boolean, not null, default true) – service visibility
- `created_at` (timestamp with time zone, default `now()`)
- `updated_at` (timestamp with time zone, default `now()`)

### 8. `learning_tools` Table

Manages learning tool descriptions for the home page.

**Structure:**
- `id` (uuid, primary key)
- `title` (text, not null) – tool name
- `description` (text, not null) – tool description
- `icon` (text, not null) – emoji or icon identifier
- `sort_order` (integer, not null, default 0) – display order
- `active` (boolean, not null, default true) – tool visibility
- `created_at` (timestamp with time zone, default `now()`)
- `updated_at` (timestamp with time zone, default `now()`)

### 9. `faqs` Table

Manages frequently asked questions, filterable by category.

**Structure:**
- `id` (uuid, primary key)
- `category` (text, not null, default 'general') – FAQ category (e.g., 'contact', 'pricing')
- `question` (text, not null) – the question text
- `answer` (text, not null) – the answer text
- `sort_order` (integer, not null, default 0) – display order within category
- `active` (boolean, not null, default true) – FAQ visibility
- `created_at` (timestamp with time zone, default `now()`)
- `updated_at` (timestamp with time zone, default `now()`)

### 10. `team_members` Table

Manages team member profiles for the about page.

**Structure:**
- `id` (uuid, primary key)
- `name` (text, not null) – team member name
- `role` (text, not null) – job title/role
- `title` (text, not null) – display title
- `image_url` (text) – profile image path
- `bio` (text) – biography text
- `expertise` (text[], not null, default '{}') – array of expertise tags
- `sort_order` (integer, not null, default 0) – display order
- `active` (boolean, not null, default true) – member visibility
- `created_at` (timestamp with time zone, default `now()`)
- `updated_at` (timestamp with time zone, default `now()`)

### 11. `about_stats` Table

Manages statistics displayed on the about page.

**Structure:**
- `id` (uuid, primary key)
- `number` (text, not null) – stat number (e.g., "10K+", "500+")
- `label` (text, not null) – stat description (e.g., "Students Worldwide")
- `sort_order` (integer, not null, default 0) – display order
- `active` (boolean, not null, default true) – stat visibility
- `created_at` (timestamp with time zone, default `now()`)
- `updated_at` (timestamp with time zone, default `now()`)

### 12. `core_values` Table

Manages core company values for the about page.

**Structure:**
- `id` (uuid, primary key)
- `icon` (text, not null) – emoji or icon identifier
- `title` (text, not null) – value name
- `description` (text, not null) – value description
- `sort_order` (integer, not null, default 0) – display order
- `active` (boolean, not null, default true) – value visibility
- `created_at` (timestamp with time zone, default `now()`)
- `updated_at` (timestamp with time zone, default `now()`)

## Content Management RLS Policies

When enabling RLS on content tables, consider these policies:

#### Content tables policies (pages, page_sections, pricing_tiers, etc.)

- Allow **public read access** for active content (since this is marketing content)
- Allow **admin users only** to perform INSERT/UPDATE/DELETE operations
- Restrict content modifications to authenticated admin users

Example policy for pricing_tiers:
```sql
-- Allow public to read active pricing
CREATE POLICY "Public read active pricing" ON pricing_tiers
FOR SELECT USING (active = true);

-- Allow admins to manage pricing
CREATE POLICY "Admins manage pricing" ON pricing_tiers
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);
```

## Migration Strategy

The content migration follows this pattern:

1. **Database First**: Create tables and seed initial content
2. **API Layer**: Build API routes to fetch content
3. **Component Updates**: Modify components to accept props instead of hardcoded data
4. **Page Integration**: Add `getStaticProps` to pages for server-side data fetching
5. **Fallback System**: Ensure components work with or without database content

This approach enables:
- **Dynamic content updates** without code deployments
- **Consistent data structure** across all content types
- **SEO-friendly static generation** with Next.js
- **Graceful degradation** during development/migration

