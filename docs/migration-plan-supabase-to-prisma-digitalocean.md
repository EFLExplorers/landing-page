# Migration Plan: Supabase → Vercel + Prisma + DigitalOcean

## Overview

This document outlines the migration strategy from Supabase to a more scalable architecture using:
- **Vercel**: Hosting (already in use)
- **Prisma**: ORM for database access
- **DigitalOcean**: Managed PostgreSQL database
- **NextAuth.js** (or Auth.js v5): Authentication replacement

## Current Architecture

### Supabase Usage
- **Database**: PostgreSQL with 12+ tables (users, teachers, pages, page_sections, pricing_tiers, etc.)
- **Authentication**: Supabase Auth (email/password)
- **Client**: Direct Supabase client calls (`@supabase/supabase-js`)
- **Server**: Supabase client in `getStaticProps` and API routes
- **Real-time**: Auth state listeners

### Key Files to Migrate
- `src/utils/supabaseClient.ts` → Replace with Prisma client
- `src/contexts/authContext.tsx` → Update to use NextAuth.js
- All pages with `getStaticProps` using Supabase → Use Prisma
- API routes (`src/pages/api/*`) → Use Prisma
- Auth components → Update to NextAuth.js

## Target Architecture

### Stack Components

1. **Vercel** (Hosting)
   - Already configured
   - Need to configure database connection pooling
   - Environment variables management

2. **DigitalOcean Managed PostgreSQL**
   - Production database
   - Connection pooling (PgBouncer recommended)
   - Automated backups
   - High availability

3. **Prisma ORM**
   - Type-safe database access
   - Schema management
   - Migrations
   - Connection pooling built-in

4. **NextAuth.js** (or Auth.js v5)
   - Email/password authentication
   - Session management
   - JWT or database sessions
   - Role-based access control

## Migration Strategy

### Phase 1: Setup & Infrastructure

#### 1.1 DigitalOcean Database Setup
```bash
# Create DigitalOcean Managed PostgreSQL Database
# Recommended specs for production:
- Plan: Basic or Professional
- Size: Based on expected traffic (start with 1GB RAM, scale as needed)
- Region: Match Vercel deployment region (or closest)
- Enable connection pooling (PgBouncer)
- Enable automated backups
```

**Connection String Format:**
```
postgresql://user:password@host:port/database?sslmode=require
```

#### 1.2 Database Migration
```bash
# Export current Supabase schema
pg_dump -h <supabase-host> -U postgres -d postgres -s > schema.sql

# Import to DigitalOcean
psql -h <digitalocean-host> -U <user> -d <database> < schema.sql

# Migrate data
pg_dump -h <supabase-host> -U postgres -d postgres -a > data.sql
psql -h <digitalocean-host> -U <user> -d <database> < data.sql
```

#### 1.3 Prisma Setup
```bash
npm install prisma @prisma/client
npx prisma init
```

**Prisma Schema Structure:**
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id         String   @id @default(uuid())
  email      String   @unique
  firstName  String?  @map("first_name")
  lastName   String?  @map("last_name")
  role       String   // "student" | "teacher" | "admin"
  approved   Boolean  @default(false)
  createdAt  DateTime @default(now()) @map("created_at")
  updatedAt  DateTime @updatedAt @map("updated_at")

  @@map("users")
}

model Teacher {
  id        String   @id @default(uuid())
  userId    String?  @map("user_id")
  email     String   @unique
  approved  Boolean  @default(false)
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  user      User?    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("teachers")
}

model Page {
  id             String        @id @default(uuid())
  route          String        @unique
  title          String?
  metaDescription String?     @map("meta_description")
  createdAt      DateTime      @default(now()) @map("created_at")
  updatedAt      DateTime      @updatedAt @map("updated_at")
  sections       PageSection[]

  @@map("pages")
}

model PageSection {
  id          String   @id @default(uuid())
  pageId      String   @map("page_id")
  sectionKey  String   @map("section_key")
  sectionType String   @default("rich-text") @map("section_type")
  heading     String?
  subheading  String?
  body        String?
  imageUrl    String?  @map("image_url")
  ctaLabel    String?  @map("cta_label")
  ctaHref     String?  @map("cta_href")
  sortOrder   Int      @default(0) @map("sort_order")
  active      Boolean  @default(true)
  data        Json     @default("{}")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  page        Page     @relation(fields: [pageId], references: [id], onDelete: Cascade)

  @@map("page_sections")
}

// Add other models: PricingTier, Service, LearningTool, FAQ, TeamMember, etc.
```

### Phase 2: Authentication Migration

#### 2.1 Install NextAuth.js
```bash
npm install next-auth@beta  # or @auth/core for Auth.js v5
npm install bcryptjs @types/bcryptjs  # for password hashing
```

#### 2.2 Create Auth Configuration
```typescript
// src/lib/auth.ts
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user) return null

        // Verify password (you'll need to migrate password hashes)
        const isValid = await bcrypt.compare(credentials.password, user.passwordHash)
        if (!isValid) return null

        return {
          id: user.id,
          email: user.email,
          role: user.role,
          approved: user.approved
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.approved = user.approved
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!
        session.user.role = token.role as string
        session.user.approved = token.approved as boolean
      }
      return session
    }
  },
  pages: {
    signIn: "/Auth/login",
    signOut: "/",
  },
  session: {
    strategy: "jwt",
    maxAge: 2 * 60 * 60, // 2 hours
  }
}
```

#### 2.3 Update Auth Context
```typescript
// src/contexts/authContext.tsx
import { useSession, signOut } from "next-auth/react"
import { Session } from "next-auth"

interface AuthContextType {
  user: Session["user"] | null
  loading: boolean
  signOut: () => Promise<void>
  userRole: "student" | "teacher" | null
  lastActivity: Date | null
  timeUntilExpiry: number | null
}

export const useAuth = () => {
  const { data: session, status } = useSession()
  
  // Implement activity tracking and timeout logic
  // Similar to current implementation but using NextAuth session
  
  return {
    user: session?.user ?? null,
    loading: status === "loading",
    signOut: async () => {
      await signOut({ callbackUrl: "/" })
    },
    userRole: session?.user?.role as "student" | "teacher" | null,
    // ... rest of implementation
  }
}
```

### Phase 3: Database Client Migration

#### 3.1 Create Prisma Client
```typescript
// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
```

#### 3.2 Replace Supabase Client Calls

**Before (Supabase):**
```typescript
const { data: pageData } = await supabase
  .from("pages")
  .select("*")
  .eq("route", "/")
  .single()
```

**After (Prisma):**
```typescript
const pageData = await prisma.page.findUnique({
  where: { route: "/" },
  include: { sections: true }
})
```

### Phase 4: Code Updates

#### 4.1 Update Pages (getStaticProps)
```typescript
// src/pages/index.tsx
import { prisma } from "@/lib/prisma"

export const getStaticProps: GetStaticProps = async () => {
  const pageData = await prisma.page.findUnique({
    where: { route: "/" },
    include: {
      sections: {
        where: { active: true },
        orderBy: { sortOrder: "asc" }
      }
    }
  })

  // ... rest of data fetching

  return {
    props: {
      pageData,
      // ... other props
    },
    revalidate: 60, // ISR revalidation
  }
}
```

#### 4.2 Update API Routes
```typescript
// src/pages/api/page-content.ts
import { prisma } from "@/lib/prisma"
import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { route } = req.query

  if (!route || typeof route !== "string") {
    return res.status(400).json({ error: "Route parameter required" })
  }

  const pageData = await prisma.page.findUnique({
    where: { route },
    include: {
      sections: {
        where: { active: true },
        orderBy: { sortOrder: "asc" }
      }
    }
  })

  if (!pageData) {
    return res.status(404).json({ error: "Page not found" })
  }

  return res.status(200).json(pageData)
}
```

#### 4.3 Update Auth Components
```typescript
// src/components/auth/forms/LoginForm.tsx
import { signIn } from "next-auth/react"

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault()
  
  const result = await signIn("credentials", {
    email,
    password,
    redirect: false,
  })

  if (result?.error) {
    setError(result.error)
    return
  }

  // Verify role and approval
  const session = await getSession()
  if (session?.user) {
    // Check role matches platform
    // Redirect accordingly
  }
}
```

### Phase 5: Environment Variables

#### 5.1 Update `.env.local`
```bash
# Database
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
DIRECT_URL="postgresql://user:password@host:port/database?sslmode=require"  # For migrations

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"  # Generate with: openssl rand -base64 32

# Platform URLs (unchanged)
NEXT_PUBLIC_STUDENT_URL=https://student.yourdomain.com
NEXT_PUBLIC_TEACHER_URL=https://teacher.yourdomain.com
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

#### 5.2 Vercel Environment Variables
- `DATABASE_URL`: DigitalOcean connection string
- `DIRECT_URL`: Direct connection (for migrations)
- `NEXTAUTH_URL`: Production URL
- `NEXTAUTH_SECRET`: Secret key
- Platform URLs (unchanged)

### Phase 6: Connection Pooling

#### 6.1 Vercel + DigitalOcean Setup
```typescript
// Use connection pooling for serverless
// DigitalOcean provides PgBouncer connection string
// Format: postgresql://user:password@host:port/database?pgbouncer=true&sslmode=require

// For Prisma, use connection pooling URL for queries
// Use DIRECT_URL for migrations
```

#### 6.2 Prisma Configuration
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")      // Pooled connection
  directUrl = env("DIRECT_URL")        // Direct connection for migrations
}
```

## Migration Checklist

### Pre-Migration
- [ ] Export Supabase database schema
- [ ] Export Supabase data
- [ ] Set up DigitalOcean PostgreSQL database
- [ ] Configure connection pooling (PgBouncer)
- [ ] Test database connectivity

### Setup
- [ ] Install Prisma and dependencies
- [ ] Create Prisma schema from Supabase schema
- [ ] Run Prisma migrations
- [ ] Import data to DigitalOcean
- [ ] Install NextAuth.js
- [ ] Set up NextAuth configuration

### Code Migration
- [ ] Create Prisma client utility
- [ ] Update all `getStaticProps` functions
- [ ] Update all API routes
- [ ] Replace Supabase auth with NextAuth
- [ ] Update auth context
- [ ] Update auth components (Login, Register)
- [ ] Update admin API routes
- [ ] Remove Supabase client imports

### Testing
- [ ] Test database queries
- [ ] Test authentication flows
- [ ] Test registration
- [ ] Test login (student/teacher/admin)
- [ ] Test password reset
- [ ] Test content pages
- [ ] Test API routes
- [ ] Test build process
- [ ] Test production deployment

### Deployment
- [ ] Update Vercel environment variables
- [ ] Deploy to staging
- [ ] Run smoke tests
- [ ] Deploy to production
- [ ] Monitor for errors
- [ ] Update documentation

## Critical Considerations

### 1. Password Migration
Supabase uses its own password hashing. You'll need to:
- Option A: Force password reset for all users
- Option B: Migrate password hashes (if compatible)
- Option C: Implement dual auth during transition

### 2. Session Management
- Supabase: JWT-based sessions
- NextAuth: Can use JWT or database sessions
- Consider session timeout compatibility

### 3. Real-time Features
- Current: Supabase auth state listeners
- Migration: NextAuth session polling or event-based updates
- May need WebSocket or polling for real-time updates

### 4. Row Level Security (RLS)
- Supabase: Built-in RLS policies
- Prisma: Application-level authorization
- Need to implement middleware/helpers for access control

### 5. Build-Time Data Fetching
- Current: Direct Supabase calls in `getStaticProps`
- Migration: Prisma calls work the same way
- Ensure connection pooling works during build

### 6. Database Migrations
- Use Prisma migrations going forward
- Keep schema in sync with Prisma schema file
- Version control migrations

## Performance Optimizations

### 1. Connection Pooling
- Use PgBouncer connection string for queries
- Use direct connection for migrations
- Configure pool size appropriately

### 2. Query Optimization
- Use Prisma `select` to limit fields
- Add database indexes (already in schema)
- Use `include` strategically to avoid N+1 queries

### 3. Caching
- Consider Redis for session storage
- Implement API route caching
- Use Next.js ISR effectively

## Cost Comparison

### Supabase (Current)
- Free tier: Limited
- Pro: ~$25/month
- Enterprise: Custom pricing

### DigitalOcean + Vercel
- DigitalOcean PostgreSQL: ~$15-60/month (depending on size)
- Vercel: Free tier available, Pro ~$20/month
- Total: ~$35-80/month

### Benefits
- More control over database
- Better scalability options
- Predictable pricing
- No vendor lock-in

## Rollback Plan

If migration fails:
1. Keep Supabase project active during migration
2. Use feature flags to switch between systems
3. Maintain parallel implementations temporarily
4. Have database backup ready
5. Document rollback procedure

## Timeline Estimate

- **Phase 1 (Setup)**: 2-3 days
- **Phase 2 (Auth)**: 3-4 days
- **Phase 3 (Database)**: 2-3 days
- **Phase 4 (Code Updates)**: 5-7 days
- **Phase 5 (Testing)**: 3-5 days
- **Phase 6 (Deployment)**: 1-2 days

**Total**: ~3-4 weeks for complete migration

## Next Steps

1. Review and approve this migration plan
2. Set up DigitalOcean database
3. Create Prisma schema
4. Begin Phase 1 implementation
5. Test in staging environment
6. Plan production migration window
