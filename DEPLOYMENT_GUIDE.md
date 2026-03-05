# A One Tarot – Deploy on Vercel (Import & Go)

## Step 1: Push to GitHub

Your repo: **https://github.com/gaurab103/AoneTarot**

```bash
git add -A && git commit -m "Updates" && git push
```

---

## Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com) → **Sign up** or **Log in**
2. Click **Add New** → **Project**
3. **Import** the repo: `gaurab103/AoneTarot`
4. **Root Directory:** set to `frontend` (required)
5. Enable **Include source files outside of the Root Directory** (Settings → Root Directory – on by default for new projects)
6. Custom build runs backend first, then Next.js

---

## Step 3: Add Environment Variables

Before deploying, add these in **Settings** → **Environment Variables**:

| Variable | Value | Required |
|----------|-------|----------|
| `DATABASE_URL` | Your Supabase PostgreSQL connection string | Yes |
| `JWT_SECRET` | A long random string (e.g. from `openssl rand -hex 32`) | Yes |
| `PAYPAL_CLIENT_ID` | Your PayPal Client ID | Yes |
| `PAYPAL_CLIENT_SECRET` | Your PayPal Client Secret | Yes |
| `PAYPAL_LIVE` | `false` (use `true` for live payments) | No |
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | Same as PAYPAL_CLIENT_ID (for frontend) | Yes |

**Do not set** `NEXT_PUBLIC_API_URL` – the app uses the same origin on Vercel.

---

## Step 4: Deploy

Click **Deploy**. Vercel will:

1. Install backend deps, run Prisma, build backend, seed DB  
2. Install frontend deps, build Next.js  
3. Deploy

That’s it. No extra setup.

---

## Admin Login

- **Email:** `admin@aonetarot.com`  
- **Password:** `admin123`  

Change this after first login.

---

## Supabase Setup

1. [supabase.com](https://supabase.com) → **New project**
2. **Settings** → **Database** → copy **Connection string** (URI)
3. Replace `[YOUR-PASSWORD]` with your database password
4. Use this as `DATABASE_URL` in Vercel

---

## Note: Live Chat

Live chat (Socket.io) does not run on Vercel serverless. The chat page may not connect. Other features (auth, bookings, payments, reviews) work normally.
