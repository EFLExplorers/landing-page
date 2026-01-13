This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

## ESL Explorers - Multi-Platform Learning Platform

ESL Explorers is a comprehensive English language learning platform with three interconnected applications:

- **Landing Page** (this app) - Marketing/marketing site with database-driven content
- **Student Portal** - Interactive learning environment for students
- **Teacher Platform** - Content management and class administration for educators

### Key Features

- **Database-Driven Content**: Marketing content stored in Supabase for easy updates
- **Multi-Role Authentication**: Student, teacher, and admin user management
- **Responsive Design**: Mobile-first design with CSS Modules
- **SEO Optimized**: Server-side rendering with Next.js for optimal performance
- **Type-Safe**: Full TypeScript implementation with proper interfaces
- **Error Boundaries**: Used around some UI sections/components
- **Comprehensive Testing**: Built-in testing framework for validation

## Database Setup

This project uses Supabase for content management and user authentication. To set up the database:

### 1. Apply Database Schema

Run the SQL files in your Supabase SQL editor:

```bash
# Apply schema and seed data
psql -f db/content-schema.sql
psql -f db/content-seed-v2.sql
```

### 2. Environment Variables

Create a `.env.local` file in the project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Platform URLs
NEXT_PUBLIC_STUDENT_URL=https://student.yourdomain.com
NEXT_PUBLIC_TEACHER_URL=https://teacher.yourdomain.com
```

### 3. Content Management

The platform uses database-driven content for marketing pages. Content is managed through these tables:

- `pages` & `page_sections` - Page content and metadata
- `content_items` - Unified typed content lists (pricing tiers, services, learning tools, team members, stats, values, etc.)
- `faqs` - Legacy/supporting table (used by some seed flows)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Project Structure

```
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── auth/            # Authentication components
│   │   ├── common/          # Shared components (ErrorBoundary, etc.)
│   │   ├── layout/          # Page layout components
│   │   │   ├── Home/        # Home page sections
│   │   │   ├── About/       # About page sections
│   │   │   └── Contact/     # Contact page sections
│   │   └── ui/              # Base UI components
│   ├── contexts/            # React contexts (auth, etc.)
│   ├── pages/               # Next.js pages and API routes
│   │   ├── api/             # API endpoints
│   │   │   ├── admin.ts     # Admin functionality
│   │   │   ├── content.ts   # Content management API
│   │   │   └── page-content.ts # Page content API
│   │   ├── Auth/            # Authentication pages
│   │   ├── _app.tsx         # App wrapper
│   │   ├── index.tsx        # Home page
│   │   ├── about.tsx        # About page
│   │   └── contact.tsx      # Contact page
│   └── utils/               # Utility functions
├── db/                      # Database schema and seed files
│   ├── content-schema.sql   # Improved database schema
│   └── content-seed-v2.sql   # DB-driven seed data (home/about/header/footer + content_items)
├── documents/               # Project documentation
│   ├── CONTENT_MIGRATION.md # Migration guide
│   ├── MIGRATION_INTEGRATION_GUIDE.md # Integration steps
│   └── TESTING_GUIDE.md     # Testing instructions
└── public/                  # Static assets
```

## Content Management

### Database-Driven Components

All marketing components now accept props from the database:

- **Props-based architecture** instead of hardcoded content
- **Type-safe interfaces** for all content types
- **Static generation** with `getStaticProps` for optimal performance
- **Error boundaries** for graceful content loading failures
- **Instant updates** via GitHub webhook triggers (no 5-minute delay)

#### Strict mode (current)

- The home page (`/`) is strict: missing Supabase env vars or missing required seeded content will fail build/SSG.
- Header/Footer copy is not hardcoded; it is rendered only when DB-provided props are present.

### Instant Content Updates

Content updates are now **instant** instead of waiting 5 minutes:

- **Trigger**: GitHub repository push to main branch
- **Action**: GitHub Actions automatically calls revalidation endpoint
- **Result**: Content appears live within seconds
- **Workflow**: See `.github/workflows/revalidate-content.yml`

See `documents/INSTANT_UPDATES.md` for complete setup and usage details.

### Testing Framework

The project includes comprehensive testing capabilities:

- **API Testing**: Validate all content endpoints return correct data
- **Page Testing**: Verify database content loads properly
- **Error Testing**: Confirm error boundaries and strict content expectations behave as expected
- **Performance Testing**: Ensure optimal loading times

See `TESTING_GUIDE.md` for complete testing instructions.

### API Endpoints

- `GET /api/page-content?route=/page` - Fetch page sections
- `GET /api/content?type=contentType` - Fetch structured content
- `POST /api/admin` - Admin functionality

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.
