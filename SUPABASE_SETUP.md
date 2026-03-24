# Supabase Setup Guide for SafeNet Prototype

This guide walks you through setting up SafeNet with Supabase PostgreSQL in under 10 minutes.

## Why Supabase?

✅ **Free Tier:** Up to 500 MB storage + unlimited API calls  
✅ **Managed PostgreSQL:** No ops overhead  
✅ **Real-time Capabilities:** For scalability  
✅ **Built-in Auth:** Optional for future upgrades  
✅ **Table Editor UI:** Easy data inspection  

---

## Step 1: Create Supabase Project (2 min)

### 1.1 Sign Up
1. Go to https://supabase.com
2. Click **"Start Your Project"**
3. Sign up with email or GitHub
4. Confirm your email

### 1.2 Create Project
1. Click **"Create a new project"**
2. Fill in:
   - **Project name:** `safenet-prototype`
   - **Database password:** Use a strong password (save it!)
   - **Region:** Select closest to India (or Singapore/Asia-Pacific)
   - **Pricing plan:** Free tier ✅
3. Click **"Create new project"**
4. Wait ~2 minutes for database to provision

---

## Step 2: Get Connection String (2 min)

### 2.1 Locate Connection Details
1. In Supabase dashboard, click your project
2. Go to **Settings** (gear icon, bottom left)
3. Click **Database**
4. Under "Connection string", copy both:
   - **Transaction Pooler URI** (for app runtime/Vercel)
   - **Direct URI** (for Prisma migrate/db pull)

### 2.2 Format Connection String
Transaction Pooler URI looks like:
```
postgresql://postgres.[PROJECT_REF]:[PASSWORD]@[POOLER_HOST]:6543/postgres?pgbouncer=true&connection_limit=1&sslmode=require
```

**Replace `[PASSWORD]`** with the password you set during project creation.

**If password has special chars**, URL-encode them:
- `#` as `%23`
- `@` as `%40`
- `!` as `%21`

**Use these env vars:**
```
DATABASE_URL="postgresql://postgres.PROJECT_REF:YOUR_PASSWORD@POOLER_HOST:6543/postgres?pgbouncer=true&connection_limit=1&sslmode=require"
DIRECT_URL="postgresql://postgres:YOUR_PASSWORD@db.PROJECT_REF.supabase.co:5432/postgres?sslmode=require"
```

---

## Step 3: Configure Local Environment (1 min)

### 3.1 Set Environment Variables
```bash
# In safenet-prototype directory:
cp .env.local.example .env.local
```

### 3.2 Edit .env.local
Open `.env.local` and replace:
```env
DATABASE_URL="postgresql://postgres.PROJECT_REF:YOUR_PASSWORD@POOLER_HOST:6543/postgres?pgbouncer=true&connection_limit=1&sslmode=require"
DIRECT_URL="postgresql://postgres:YOUR_PASSWORD@db.PROJECT_REF.supabase.co:5432/postgres?sslmode=require"
```

Example:
```env
DATABASE_URL="postgresql://postgres.abcdefgh123456:MyP%40ssw0rd%21@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1&sslmode=require"
DIRECT_URL="postgresql://postgres:MyP%40ssw0rd%21@db.abcdefgh123456.supabase.co:5432/postgres?sslmode=require"
```

Save the file.

---

## Step 4: Initialize Database (2 min)

### 4.1 Install Dependencies
```bash
npm install
```

### 4.2 Generate Prisma Client
```bash
npm run prisma:generate
```

### 4.3 Run Migrations
```bash
npm run prisma:migrate
```

Output should show:
```
Your database is now in sync with your schema. ✨
```

### 4.4 Seed Sample Data
```bash
npm run seed
```

Expected output:
```
✅ Cleared existing data
✅ Created 3 platforms
✅ Created 20 moderators
✅ Created 45 content items
✅ Created 4 alerts
✨ Database seeding completed successfully!
```

---

## Step 5: Verify in Supabase UI (2 min)

### 5.1 View Tables
1. Go back to Supabase dashboard
2. Click **Table Editor** (left sidebar)
3. You should see tables:
   - `moderators` (20 rows)
   - `contents` (45 rows)
   - `platforms` (3 rows)
   - `alerts` (4 rows)
   - `moderation_logs` (empty)

### 5.2 Inspect Sample Data
```sql
-- Run in Supabase SQL Editor
SELECT name, language, "trainingStatus", "accuracyScore" 
FROM moderators 
WHERE "trainingStatus" = 'verified' 
LIMIT 5;
```

Expected result: 15+ verified moderators from India (Hindi, Tamil, etc.)

---

## Step 6: Run Locally (1 min)

```bash
npm run dev
```

Open http://localhost:3000 and test:
1. **Home page** → Shows SafeNet intro
2. **Moderator Onboarding** → Sign up → Training → Verify
3. **Moderation Queue** → See pending content
4. **Admin Dashboard** → View KPIs from Supabase data

---

## Optional: Get API Keys (for real-time features later)

1. Supabase dashboard → **Settings** → **API**
2. Copy:
   - **Project URL:** `https://PROJECT_REF.supabase.co`
   - **Anon Key:** (for client-side, keep secret)
3. Add to `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL="https://PROJECT_REF.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_ANON_KEY"
   ```

---

## Troubleshooting

### ❌ `Can't connect to PostgreSQL`
**Error:** `error: getaddrinfo ENOTFOUND PROJECT_REF.supabase.co`

**Fix:**
- Verify `DATABASE_URL` uses pooler host and port `6543`
- Verify `DIRECT_URL` uses `db.PROJECT_REF.supabase.co:5432`
- Ensure password is URL-encoded
- Ensure no extra spaces in URLs

**Test connection:**
```bash
npm run db:check
# For schema introspection/migrations:
npx prisma db pull
```

### ❌ `sslmode` errors
**Error:** `could not determine server certificate`

**Fix:**
- Ensure `&sslmode=require` is at END of DATABASE_URL
- Example: `...public?schema=public&sslmode=require`

### ❌ Migrations fail
**Error:** `error: relation "moderators" does not exist`

**Fix:**
```bash
# Reset and retry
npm run prisma:migrate reset
npm run seed
```

### ❌ Port 5432 in use locally
**Error:** `FATAL: role "postgres" does not exist`

**Fix:**
- You may be pointing to local Postgres by mistake
- Verify `DIRECT_URL` is `db.PROJECT_REF.supabase.co:5432`
- Verify runtime `DATABASE_URL` is pooler on `:6543`

---

## Limits & Pricing (Free Tier)

- **Storage:** 500 MB (plenty for prototype with ~45 content items)
- **API Calls:** Unlimited
- **Auth Users:** 50,000
- **Database Connections:** 10
- **Compute:** Shared
- **SSL:** Included ✅

**Upgrade when:** Growing beyond 500 MB or need more compute power

---

## Next Steps

1. Start dev server: `npm run dev`
2. Test all 3 workflows
3. Share demo link for investor feedback
4. When ready: Deploy to Vercel (DEPLOYMENT.md)

---

## Support

- **Supabase Docs:** https://supabase.com/docs
- **Supabase Support:** https://supabase.com/support
- **Prisma + Supabase:** https://www.prisma.io/docs/reference/database-reference/connection-urls#postgresql

---

**Setup complete! You're ready to demo SafeNet. 🚀**
