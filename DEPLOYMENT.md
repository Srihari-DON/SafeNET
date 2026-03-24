# Deployment Guide: SafeNet to Vercel (with Supabase)

A complete guide to deploy SafeNet prototype to production in 15 minutes using Vercel (frontend/API) and Supabase (database).

## Prerequisites

- Supabase project created (see SUPABASE_SETUP.md)
- GitHub account
- Vercel account
- Supabase connection string saved

---

## Step 1: Prepare Supabase Database

If you haven't already, complete SUPABASE_SETUP.md first:
1. Create Supabase project
2. Get connection string
3. Run migrations and seed data locally
4. Verify in Supabase dashboard

You should have:
- `DATABASE_URL` from Supabase (keep this secure!)
- Database with tables: moderators, contents, platforms, alerts

---

## Step 2: Push Code to GitHub

```bash
# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "SafeNet prototype - initial commit"

# Create repository on GitHub at https://github.com/new
# Then push:
git remote add origin https://github.com/YOUR_USERNAME/safenet-prototype.git
git branch -M main
git push -u origin main
```

---

## Step 3: Deploy to Vercel

### Option A: Via Vercel Dashboard (Easiest)

1. Go to https://vercel.com/login
2. Click **"Add New"** → **"Project"**
3. **Import your GitHub repo**
   - Select `safenet-prototype`
   - Click "Import"

4. **Configure Project**
   - Framework Preset: Next.js ✅ (auto-detected)
   - Root Directory: . (default)
   - Build Command: `npm run build` ✅

5. **Add Environment Variables**
   - Click **"Environment Variables"**
   - Add:
     ```
     Name: DATABASE_URL
     Value: postgresql://postgres:YOUR_PASSWORD@PROJECT_REF.supabase.co:5432/postgres?schema=public&sslmode=require
     ```
   - Production: ✅ checked
   - Preview: ✅ checked
   - Development: ✅ checked
   - Click **"Add"**

6. **Deploy**
   - Click **"Deploy"**
   - Wait ~3 minutes for deployment to complete

7. **Verify**
   - Click the deployment URL (e.g., `safenet-demo.vercel.app`)
   - Test home page, workflows, API endpoints

---

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# 1. Which scope? (select your username)
# 2. Link to existing project? (no for first deploy)
# 3. Project name: safenet-prototype
# 4. Directory: . (current)
# 5. Framework: Next.js (auto-use)

# Add environment variable
vercel env add DATABASE_URL
# Paste: postgresql://postgres:YOUR_PASSWORD@PROJECT_REF.supabase.co:5432/postgres?schema=public&sslmode=require

# Deploy to production
vercel --prod
```

---

## Step 4: Run Database Migrations on Vercel

After deployment, migrations must run on Vercel's server:

### Option A: Via Vercel CLI (Recommended)

```bash
# SSH into Vercel deployment
vercel shell

# Run migrations
npm run prisma:migrate

# Seed data (optional, if needed for production)
npm run seed

# Exit
exit
```

### Option B: Add Post-Build Script (Automatic)

Edit `package.json`:
```json
{
  "scripts": {
    "build": "next build",
    "postbuild": "prisma migrate deploy --skip-generate"
  }
}
```

Then redeploy:
```bash
git add package.json
git commit -m "Add postbuild migration"
git push origin main
```

Vercel will auto-run migrations after build.

---

## Step 5: Verify Deployment

### Test URLs

1. **Home Page:** https://your-domain.vercel.app/
2. **Moderator Onboarding:** https://your-domain.vercel.app/moderation/onboarding
3. **Moderation Queue:** https://your-domain.vercel.app/moderation/queue
4. **Admin Dashboard:** https://your-domain.vercel.app/admin/dashboard
5. **API Endpoints:**
   - https://your-domain.vercel.app/api/moderators
   - https://your-domain.vercel.app/api/contents
   - https://your-domain.vercel.app/api/analytics

### Verify Database Connection

```bash
# Test API endpoints return data
curl https://your-domain.vercel.app/api/moderators | jq .

# Should see moderators array with 20+ items
```

If API returns empty, run migrations:
```bash
vercel shell
npm run prisma:migrate
npm run seed
exit
```

---

## Step 6: Custom Domain (Optional)

### Add Custom Domain

1. Go to Vercel project settings
2. Click **Domains**
3. Enter domain (e.g., `safenet-demo.com`)
4. Follow DNS setup instructions from your domain provider

---

## Troubleshooting

### ❌ `DATABASE_URL not set` Error

**Error:** `Error: Missing environment variable DATABASE_URL`

**Fix:**
1. Go to Vercel project settings
2. Click **Environment Variables**
3. Add `DATABASE_URL` with your Supabase connection string
4. Redeploy: `git push origin main`

---

### ❌ API returns empty data

**Error:** `/api/moderators` returns `{"success":true,"data":[]}`

**Fix:** Migrations didn't run or seed didn't execute
```bash
vercel shell
npm run prisma:migrate
npm run seed
exit
```

---

### ❌ SSL/Certificate errors

**Error:** `could not determine server certificate` or `SSL required`

**Fix:**
- Verify `&sslmode=require` at END of DATABASE_URL
- Verify password is URL-encoded if it contains special chars
- Test locally first: `npm run dev`

---

### ❌ Build fails: "Prisma client not found"

**Error:** `Cannot find module .prisma/client`

**Fix:**
```bash
npm run prisma:generate
git add .prisma/
git commit -m "Add generated Prisma client"
git push origin main
```

---

### ❌ Vercel function timeout (504 errors)

**Error:** `Function timed out after 10 seconds`

**Fix:** Increase timeout in `vercel.json`:
```json
{
  "functions": {
    "pages/api/**": {
      "maxDuration": 60
    }
  }
}
```

Then redeploy.

---

## Monitoring & Logs

### View Real-Time Logs

```bash
vercel logs [your-domain.vercel.app]
```

### Monitor Function Calls

1. Vercel dashboard → Project → **Functions**
2. See API call count, errors, runtime

### View Database Logs

1. Supabase dashboard → your project
2. **Logs** (left sidebar) → **Network** or **Query**
3. See database connections and queries

---

## Continuous Deployment

### Auto-Deploy on Push

Once linked:
1. Push to `main` branch
2. Vercel auto-builds and deploys
3. Deployment takes ~2-3 minutes

Check status:
```bash
vercel list
```

Get deployment URL for current state:
```bash
vercel
```

---

## Rollback to Previous Deployment

```bash
# View all deployments
vercel list

# Rollback to previous
vercel rollback [deployment-id]
```

---

## Performance Optimization

### Enable Caching

Add to API routes (`pages/api/*`):
```typescript
res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=600');
```

### Edge Caching

Supabase + Vercel automatically cache:
- Static assets (images, CSS, JS)
- API responses (if caching headers set)
- Database queries (be careful with this)

---

## Cost Summary

### Supabase (Free Tier)
- Database: Free
- Storage: 500 MB (plenty for demo)
- Bandwidth: Generous free limits

### Vercel (Free Tier)
- Deployments: Unlimited
- Serverless Functions: Shared (no cold starts for hobby tier)
- Bandwidth: 100 GB/mo
- Build time: 6,000 min/mo

**Total: $0/month for prototype** ✅

---

## Next: Investor Demo

Once deployed, share the URL with investors:

**5-Minute Walkthrough:**
1. **Home** (30s) - Problem statement
2. **Moderator Onboarding** (1m) - Sign up + training
3. **Moderation Queue** (1.5m) - Review content
4. **Admin Dashboard** (1.5m) - Business metrics
5. **Q&A** (30s) - Market, GTM, traction

---

## Summary Checklist

- [ ] Database migrated to Supabase
- [ ] Code pushed to GitHub
- [ ] Vercel project created & linked
- [ ] DATABASE_URL environment variable set
- [ ] Deployment successful (no errors)
- [ ] Migrations ran on Vercel
- [ ] API endpoints return data
- [ ] All 3 workflows tested end-to-end
- [ ] Shared demo link with stakeholders

---

## Resources

- **Vercel Docs:** https://vercel.com/docs
- **Supabase + Vercel Guide:** https://supabase.com/docs/guides/hosting/vercel
- **Prisma Deployment:** https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel

---

**Deployment complete! Your SafeNet prototype is live. 🚀**
