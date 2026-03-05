# Database Setup Guide - A One Tarot

Choose **one** option below. **Supabase** (Option A) is recommended for quick setup.

---

## Option A: Supabase (Recommended - Free)

1. **Create account** at [supabase.com](https://supabase.com) → Sign up (free)

2. **Create a new project**
   - Click "New Project"
   - Name: `aone-tarot`
   - Set a database password (save it!)
   - Region: Choose closest to you
   - Click "Create new project" (wait ~2 min)

3. **Get connection string**
   - Go to **Project Settings** (gear icon) → **Database**
   - Scroll to **Connection string** → **URI**
   - Copy the URI (looks like: `postgresql://postgres.[project-ref]:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres`)
   - **Replace `[YOUR-PASSWORD]`** with your database password
   - Add `?sslmode=require` at the end if not present

4. **Update backend/.env**
   ```
   DATABASE_URL="postgresql://postgres.xxxxx:YOUR_PASSWORD@aws-0-xx.pooler.supabase.com:6543/postgres?sslmode=require"
   ```

---

## Option B: Neon (Free)

1. Go to [neon.tech](https://neon.tech) → Sign up

2. **Create project** → Name it `aone-tarot`

3. **Copy connection string** from the dashboard (Connection string section)

4. **Update backend/.env**
   ```
   DATABASE_URL="postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require"
   ```

---

## Option C: Local PostgreSQL

1. Install PostgreSQL from [postgresql.org](https://www.postgresql.org/download/windows/)

2. Create database:
   ```bash
   psql -U postgres -c "CREATE DATABASE aonetarot;"
   ```

3. **Update backend/.env**
   ```
   DATABASE_URL="postgresql://postgres:your_password@localhost:5432/aonetarot"
   ```

---

## After setting DATABASE_URL

Run these commands in the **backend** folder:

```bash
cd backend
npx prisma generate
npx prisma db push
npm run db:seed
```

Then start the servers (see README or run commands below).
