## Supabase Integration Overview

### Environment Variables

The app uses Supabase both on the client and on API routes. Configure these in a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_URL=your_supabase_project_url                # same as above, used by admin API
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key       # NEVER expose this to the client
NEXT_PUBLIC_STUDENT_URL=https://student.yourdomain.com
NEXT_PUBLIC_TEACHER_URL=https://teacher.yourdomain.com
```

### Client Supabase Client (`src/utils/supabaseClient.ts`)

- Creates a browser-safe Supabase client using `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Throws an error at build/runtime if the environment variables are missing.

### Auth Context (`src/contexts/authContext.tsx`)

- Uses `supabase.auth.getSession()` and `supabase.auth.onAuthStateChange` to manage `user` and `userRole` in React context.
- Reads the `role` field from the `users` table using the current user `id`.

### Registration Flow (`src/components/auth/forms/RegistrationForm.tsx`)

- Calls `supabase.auth.signUp` with `email` and `password`.
- Stores `first_name`, `last_name`, and `role` in the auth user metadata.
- Inserts a matching row into the `users` table with:
  - `id` (Supabase auth user id)
  - `email`
  - `first_name`
  - `last_name`
  - `role` (`"student"` or `"teacher"`)
  - `approved` (boolean: `true` for students, `false` for teachers until admin approves)
- Redirects:
  - Teachers to `/Auth/register/teacher/pending`.
  - Students to `${NEXT_PUBLIC_STUDENT_URL}/dashboard`.

### Login Flow (`src/components/auth/forms/LoginForm.tsx`)

- Uses `supabase.auth.signInWithPassword` with `email` and `password`.
- After login, reads `role` and `approved` from the `users` table for the current user.
- Validates that `role` matches the selected platform and that teachers are `approved`.
- Redirects:
  - Teachers to `${NEXT_PUBLIC_TEACHER_URL}/dashboard`.
  - Students to `${NEXT_PUBLIC_STUDENT_URL}/dashboard`.

### Admin Login (`src/pages/Auth/login/admin/index.tsx`)

- A special admin login form that signs in with email/password.
- After auth, checks the `users` table for a row where `id` matches the logged-in user and `role` is `"admin"`.
- On success, navigates to `/admin/dashboard`.

### API Routes

#### `src/pages/api/getUserRole.ts`

- POST endpoint that accepts `{ userId }`.
- Uses the public Supabase client to query the `users` table:
  - `select("role")` where `id = userId`.
- Returns `{ role }` or an error if no user is found.

#### `src/pages/api/admin.ts`

- Uses an **admin Supabase client** created with `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.
- POST endpoint expecting `{ email, action, ... }`.
- Workflows:
  - Validates that the calling user (by `email`) has `role = "admin"` in the `users` table.
  - For `action === "approve-teacher"` and `emailToApprove` in the body:
    - Updates the `teachers` table, setting `approved = true` for the given teacher `email`.

### Content Management API Routes

#### `src/pages/api/page-content.ts`

- GET endpoint that accepts `?route={route}` parameter (e.g., `?route=/`, `?route=/about`).
- Uses the public Supabase client to query page content.
- Returns structured page data including:
  - Page metadata (`title`, `meta_description`)
  - Page sections with content (`heading`, `body`, `cta_label`, etc.)
- Used by `getStaticProps` in page components for database-driven content.

#### `src/pages/api/content.ts`

- GET endpoint that accepts `?type={contentType}&category={optionalCategory}` parameters.
- Supports multiple content types:
  - `pricing` - Returns pricing tiers
  - `services` - Returns service offerings
  - `learning-tools` - Returns learning tool descriptions
  - `faqs` - Returns frequently asked questions (optionally filtered by category)
  - `team-members` - Returns team member profiles
  - `about-stats` - Returns about page statistics
  - `core-values` - Returns company core values
- Used by page components to fetch structured content arrays.

### Database-Driven Content System

#### Component Architecture

All marketing page components now follow a **props-based architecture**:

- **Before**: Hardcoded content arrays within components
- **After**: Components accept props from database queries

Example transformation:
```tsx
// Before (hardcoded)
export const PricingSection = () => {
  const pricingTiers = [/* hardcoded data */];

// After (props-based)
export const PricingSection = ({ pricingTiers }: PricingSectionProps) => {
  // pricingTiers comes from database via getStaticProps
```

#### Page Data Flow

1. **Database**: Content stored in structured tables (`pages`, `page_sections`, `pricing_tiers`, etc.)
2. **Direct Database Calls**: Pages use Supabase client directly in `getStaticProps` for build-time data fetching
3. **API Routes**: Available for runtime content fetching and admin operations
4. **Components**: Receive data as props, with fallback to hardcoded content if database unavailable
5. **Rendering**: Dynamic content rendered with proper TypeScript types

#### Build-Time Data Fetching

For optimal performance during static generation, pages use direct Supabase client calls:

```typescript
export const getStaticProps: GetStaticProps = async () => {
  const { supabase } = await import("../../utils/supabaseClient");

  // Direct database queries during build
  const { data: pageData } = await supabase
    .from("pages")
    .select("*")
    .eq("route", "/")
    .single();

  // ... additional queries
};
```

This approach:
- ✅ Works during Next.js build process
- ✅ Provides better performance than HTTP calls
- ✅ Enables proper static generation
- ✅ Maintains revalidation for content updates

#### Content Migration Strategy

- **Pages Table**: Stores route metadata (`title`, `meta_description`) for SEO
- **Page Sections Table**: Stores structured content blocks by `section_key`
- **Content Tables**: Specialized tables for repeated content types (pricing, services, team members, etc.)
- **Fallback System**: Components gracefully degrade to hardcoded content during development/migration

### Summary

- **Public client**: `src/utils/supabaseClient.ts` (for auth and general user-facing queries).
- **Admin client**: `src/pages/api/admin.ts` using service role key (server-side only).
- **Core tables**: `users` (all users + roles/approval) and `teachers` (admin approval tracking).
- **Routing**: env-based platform URLs for students/teachers, with admin-specific pages and API routes.

