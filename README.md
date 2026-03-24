# SafeNet Prototype - Women-Focused Safety Infrastructure for India

A Next.js + PostgreSQL prototype demonstrating a distributed moderator network platform for Indian content platforms.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Supabase account (free tier available)
- npm or yarn

### 1. Setup Supabase Database

1. Go to https://supabase.com and sign up (free tier available)
2. Create a new project:
   - Name: `safenet-prototype`
   - Region: Closest to you (recommended: India if available)
   - Password: Save this securely
3. Once created, go to **Project Settings** → **Database** → **Connection string**
4. Copy the **Transaction Pooler URI** connection string (starts with `postgresql://`)
5. In the connection string, replace `[PASSWORD]` with the password you set
6. URL-encode special chars in password (`#` -> `%23`, `@` -> `%40`, `!` -> `%21`)
7. Use pooler format for deploy/runtime, for example:
   `postgresql://postgres.PROJECT_REF:YOUR_PASSWORD@POOLER_HOST:6543/postgres?pgbouncer=true&connection_limit=1&sslmode=require`

**Optional: Get Supabase Keys**
- Go to **Settings** → **API** 
- Copy **Project URL** and **anon public key** (for real-time features)

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment
```bash
# Copy the example env file
cp .env.local.example .env.local

# Edit .env.local with your Supabase connection string
# DATABASE_URL="postgresql://postgres.PROJECT_REF:YOUR_PASSWORD@POOLER_HOST:6543/postgres?pgbouncer=true&connection_limit=1&sslmode=require"
# DIRECT_URL="postgresql://postgres:YOUR_PASSWORD@db.PROJECT_REF.supabase.co:5432/postgres?sslmode=require"
```

### 4. Initialize Database
```bash
# Generate Prisma client
npm run prisma:generate

# Create tables in Supabase
npm run prisma:migrate

# Seed sample data (Indian names, realistic content)
npm run seed
```

### 5. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
safenet-prototype/
├── pages/
│   ├── api/                    # Backend API routes
│   │   ├── moderators.ts       # GET/POST moderators
│   │   ├── contents.ts         # GET/POST moderation queue
│   │   ├── contents/[id].ts    # PATCH content decisions
│   │   ├── platforms.ts        # GET platform list
│   │   ├── analytics.ts        # GET KPI metrics
│   │   └── alerts.ts           # GET threat alerts
│   ├── moderation/             # Moderator workflows
│   ├── admin/                  # Platform admin dashboards
│   └── index.tsx               # Home/onboarding
├── components/                 # Reusable React components
├── lib/
│   ├── firebase.ts            # Prisma client (PostgreSQL)
│   ├── types.ts               # TypeScript interfaces
│   └── mockData.ts            # Sample data
├── prisma/
│   └── schema.prisma          # Database schema
├── scripts/
│   └── seed.ts                # Data seeding script
└── public/                    # Static assets
```

---

## 🏗️ Database Schema

### Moderators
- id, name, email, phone, language, hoursAvailable, hourlyRate
- trainingStatus (new, in_training, verified, inactive)
- trainedModules, verifiedAt, joinedAt
- totalReviews, accuracyScore, currentStreak

### ContentItem
- id, platformId, text, authorId, createdAt
- moderatorId, decision, severity, category, reason
- contextUrl, flaggedAt

### Platform
- id, name, subscriptionTier, monthlySpend
- activeModeratorCount, monthlyReviewVolume, contactEmail

### Alert
- id, pattern, detectionCount, region, severity
- firstDetectedAt, description

### ModerationLog
- id, contentId, moderatorId, decision, category
- reason, timeSpent, createdAt

---

## 🎯 Three Demo Workflows

### 1. **Moderator Onboarding**
- Sign-up form (name, phone, email, language, availability)
- 4-module training (Harassment, Grooming, Rules, Abuse Lexicon)
- Certificate screen + verification

### 2. **Content Moderation**
- Queue view (card-based, 10 items per page)
- Single content review (policy sidebar, decision buttons)
- Batch analytics (volume, accuracy, escalations)

### 3. **Admin Dashboard**
- KPI overview (active mods, reviews, cost, response time)
- Team management (list, status, accuracy score)
- Analytics graphs (weekly trends, false positive rate)

---

## 🔗 API Endpoints

### Moderators
- `GET /api/moderators` - List all moderators
- `POST /api/moderators` - Create new moderator

### Contents
- `GET /api/contents?page=1` - Get paginated content queue
- `POST /api/contents` - Add new content to review
- `GET /api/contents/[id]` - Get single content
- `PATCH /api/contents/[id]` - Submit moderation decision

### Platforms
- `GET /api/platforms` - List all platforms

### Analytics
- `GET /api/analytics?platformId=koo` - Get KPI metrics

### Alerts
- `GET /api/alerts` - Get threat intelligence alerts

---

## 🧪 Testing

### View Database Data in Supabase

1. Go to your Supabase project: https://app.supabase.com
2. Select your project
3. Click **Table Editor** in the sidebar
4. View tables:
   - `moderators` - see 20 sample moderators
   - `contents` - see 45 content items (approved, flagged, pending)
   - `platforms` - see 3 platform records
   - `alerts` - see 4 threat alerts

### Direct SQL Queries

1. Go to Supabase **SQL Editor**
2. Run queries:
   ```sql
   SELECT * FROM moderators LIMIT 5;
   SELECT * FROM contents WHERE decision = 'pending' LIMIT 10;
   SELECT COUNT(*) FROM moderators WHERE "trainingStatus" = 'verified';
   ```

### Test API Routes
```bash
# In browser, navigate to:
# http://localhost:3000/api/moderators
# http://localhost:3000/api/contents
# http://localhost:3000/api/platforms
```

---

## 🚀 Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# You'll be prompted to:
# 1. Set DATABASE_URL environment variable
# 2. Link to your GitHub repo (optional)

# Generate and migrate on deployment
vercel env add DATABASE_URL
vercel deploy --prod
```

---

## 📊 Sample Data

The seed script (`npm run seed`) generates:
- **20 realistic Indian moderators** (women & men, various languages: Hindi, Tamil, Telugu, English, Marathi)
- **45 content items**: 15 abuse (harassment, grooming, hate speech), 15 clean, 15 pending review
- **3 platforms**: Koo, ShareChat, Bonanza (mock)
- **4 threat alerts**: emerging slurs, coordinated campaigns, misinformation, grooming spikes

---

## 💡 Next Steps

1. **Frontend Build** (3.5 hours)
   - Moderator onboarding UI (Chakra components)
   - Moderation workflow UI
   - Admin dashboard UI

2. **Integration** (1.5 hours)
   - Connect React to API endpoints
   - Add loading states, error handling
   - Form validation

3. **Polish & Deploy** (0.5 hours)
   - Add keyboard shortcuts (A=Approve, F=Flag, E=Escalate)
   - Deploy to Vercel
   - Create investor walkthrough script

---

## 📝 Notes

- **Data is pre-seeded**: No manual entry needed for demo
- **Mock data only**: This is a prototype; no real moderation happens
- **India-first**: All sample data uses Indian languages, platforms, abuse contexts
- **Investor-ready**: 3 workflows demonstrated end-to-end in <5 min walkthrough

---

## 🆘 Troubleshooting

### `DATABASE_URL not set`
→ Check .env.local file exists and has correct PostgreSQL URL

### `Prisma client not found`
```bash
npm run prisma:generate
```

### `Cannot connect to PostgreSQL`
→ Most often this means the URL/host is wrong or unreachable
→ For Vercel runtime, use the Supabase pooler URI (port `6543`), not the direct DB host
→ Keep local `prisma db pull`/migrations on `DIRECT_URL` if needed
```bash
npm run db:check
```

### Port 3000 already in use
```bash
npm run dev -- -p 3001
```

---

## 📞 Support

For questions about SafeNet MVP:
- Review `schema.prisma` for database structure
- Check `pages/api/` for API implementation
- Review `lib/types.ts` for TypeScript contracts

---

**Built with ❤️ for women's safety in digital spaces across India**
