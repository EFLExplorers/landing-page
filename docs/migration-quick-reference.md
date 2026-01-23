# Migration Quick Reference: Supabase → Prisma + DigitalOcean

## Key Changes Summary

### 1. Database Client Replacement

**Before (Supabase):**
```typescript
import { supabase } from "@/utils/supabaseClient"

const { data } = await supabase
  .from("pages")
  .select("*")
  .eq("route", "/")
  .single()
```

**After (Prisma):**
```typescript
import { prisma } from "@/lib/prisma"

const page = await prisma.page.findUnique({
  where: { route: "/" },
  include: { sections: true }
})
```

### 2. Authentication Replacement

**Before (Supabase Auth):**
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password
})
```

**After (NextAuth.js):**
```typescript
import { signIn } from "next-auth/react"

const result = await signIn("credentials", {
  email,
  password,
  redirect: false
})
```

### 3. Session Management

**Before:**
```typescript
const { data: { session } } = await supabase.auth.getSession()
supabase.auth.onAuthStateChange((event, session) => { ... })
```

**After:**
```typescript
import { useSession } from "next-auth/react"

const { data: session, status } = useSession()
```

### 4. Environment Variables

**Remove:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

**Add:**
- `DATABASE_URL` - DigitalOcean PostgreSQL connection string (pooled)
- `DIRECT_URL` - Direct connection for migrations
- `NEXTAUTH_URL` - Your app URL
- `NEXTAUTH_SECRET` - Secret key (generate with `openssl rand -base64 32`)

### 5. Common Query Patterns

#### Fetch Page with Sections
```typescript
// Prisma
const page = await prisma.page.findUnique({
  where: { route: "/" },
  include: {
    sections: {
      where: { active: true },
      orderBy: { sortOrder: "asc" }
    }
  }
})
```

#### Fetch Content Items by Type
```typescript
// Prisma
const items = await prisma.contentItem.findMany({
  where: {
    contentType: "pricing",
    active: true
  },
  orderBy: { sortOrder: "asc" }
})
```

#### Filter with Multiple Conditions
```typescript
// Prisma
const faqs = await prisma.fAQ.findMany({
  where: {
    category: "contact",
    active: true
  },
  orderBy: { sortOrder: "asc" }
})
```

### 6. File Structure Changes

**New Files:**
- `prisma/schema.prisma` - Database schema
- `src/lib/prisma.ts` - Prisma client singleton
- `src/lib/auth.ts` - NextAuth configuration
- `src/pages/api/auth/[...nextauth].ts` - NextAuth API route

**Files to Update:**
- All pages with `getStaticProps` - Replace Supabase with Prisma
- All API routes - Replace Supabase with Prisma
- `src/contexts/authContext.tsx` - Use NextAuth hooks
- `src/components/auth/forms/*` - Update to NextAuth

**Files to Remove:**
- `src/utils/supabaseClient.ts` (after migration complete)

### 7. Package Changes

**Remove:**
```bash
npm uninstall @supabase/supabase-js
```

**Add:**
```bash
npm install prisma @prisma/client next-auth@beta bcryptjs
npm install -D @types/bcryptjs
```

### 8. Database Connection

**DigitalOcean Setup:**
1. Create Managed PostgreSQL database
2. Enable connection pooling (PgBouncer)
3. Get connection strings:
   - Pooled: `postgresql://user:pass@host:port/db?pgbouncer=true&sslmode=require`
   - Direct: `postgresql://user:pass@host:port/db?sslmode=require`

**Prisma Configuration:**
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")      // Pooled
  directUrl = env("DIRECT_URL")        // Direct
}
```

### 9. Migration Commands

```bash
# Initialize Prisma
npx prisma init

# Generate Prisma Client
npx prisma generate

# Create migration from schema
npx prisma migrate dev --name init

# Apply migrations to production
npx prisma migrate deploy

# Open Prisma Studio (database GUI)
npx prisma studio
```

### 10. Testing Checklist

- [ ] Database connection works
- [ ] Prisma queries return correct data
- [ ] Authentication login works
- [ ] Authentication registration works
- [ ] Password reset works
- [ ] Session management works
- [ ] All pages load correctly
- [ ] API routes work
- [ ] Build process succeeds
- [ ] Production deployment works

### 11. Common Issues & Solutions

**Issue: Connection pool exhausted**
- Solution: Use PgBouncer connection string, not direct connection

**Issue: Migration fails**
- Solution: Use `DIRECT_URL` for migrations, `DATABASE_URL` for queries

**Issue: Auth session not persisting**
- Solution: Check `NEXTAUTH_SECRET` is set, verify `NEXTAUTH_URL` matches deployment

**Issue: Password hashing mismatch**
- Solution: Implement password migration strategy (see main migration plan)

**Issue: Build fails in Vercel**
- Solution: Ensure `DATABASE_URL` and `DIRECT_URL` are set in Vercel environment variables

### 12. Performance Tips

1. **Use connection pooling** - Always use PgBouncer URL for queries
2. **Select specific fields** - Use Prisma `select` instead of fetching all fields
3. **Use indexes** - Ensure database indexes match query patterns
4. **Batch queries** - Use `include` to avoid N+1 queries
5. **Cache when possible** - Use Next.js ISR and API route caching

### 13. Rollback Strategy

If migration fails:
1. Keep Supabase project active
2. Use feature flags to toggle between systems
3. Maintain environment variable switches
4. Have database backup ready
5. Document rollback procedure

### 14. Support Resources

- **Prisma Docs**: https://www.prisma.io/docs
- **NextAuth.js Docs**: https://next-auth.js.org
- **DigitalOcean PostgreSQL**: https://docs.digitalocean.com/products/databases/postgresql/
- **Vercel Environment Variables**: https://vercel.com/docs/concepts/projects/environment-variables
