# A One Tarot – Step-by-Step Deployment Guide

## Before You Start

You need:
- [GitHub](https://github.com) account
- [Render](https://render.com) account (free tier works)
- [Supabase](https://supabase.com) account (for PostgreSQL)
- [PayPal Developer](https://developer.paypal.com) account (for payments)

---

## Step 1: Push to GitHub

Your code is already at: **https://github.com/gaurab103/AoneTarot**

If you have local changes:

```bash
cd "c:\Users\LENOVO\OneDrive\Desktop\Aone Tarot"
git add -A
git commit -m "Your message"
git push origin main
```

---

## Step 2: Set Up Supabase Database

1. Go to [supabase.com](https://supabase.com) → **Start your project**
2. Create a new project (e.g. `aone-tarot`)
3. Wait for the database to be ready
4. Go to **Project Settings** → **Database**
5. Copy the **Connection string** (URI format)
   - Use the one with password: `postgresql://postgres:[YOUR-PASSWORD]@...`
   - Replace `[YOUR-PASSWORD]` with your actual database password

---

## Step 3: Deploy on Render (Frontend + Backend)

### 3.1 Create Blueprint

1. Go to [render.com](https://render.com) → **Sign up** or **Log in**
2. Click **New +** → **Blueprint**
3. Connect your GitHub account if needed
4. Select the repo: **gaurab103/AoneTarot**
5. Click **Connect**

### 3.2 Render Creates Both Services

Render will read `render.yaml` and create:
- **aone-tarot-api** (backend)
- **aone-tarot** (frontend)

Click **Apply** to create them.

### 3.3 Configure Backend (aone-tarot-api)

1. Open the **aone-tarot-api** service
2. Go to **Environment** tab
3. Add these variables:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | Your Supabase connection string from Step 2 |
| `JWT_SECRET` | A long random string (e.g. run `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`) |
| `FRONTEND_URL` | `https://aone-tarot.onrender.com` (or your frontend URL – see Step 3.5) |
| `PAYPAL_CLIENT_ID` | Your PayPal Client ID |
| `PAYPAL_CLIENT_SECRET` | Your PayPal Client Secret |
| `PAYPAL_LIVE` | `false` (use `true` for production payments) |

4. Click **Save Changes**
5. Go to **Manual Deploy** → **Deploy latest commit** (or wait for auto-deploy)

### 3.4 Get Backend URL

1. After the backend deploys, open the **aone-tarot-api** service
2. Copy the URL at the top (e.g. `https://aone-tarot-api.onrender.com`)

### 3.5 Configure Frontend (aone-tarot)

1. Open the **aone-tarot** service
2. Go to **Environment** tab
3. Add:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_API_URL` | Your backend URL (e.g. `https://aone-tarot-api.onrender.com`) |

4. Click **Save Changes**
5. If the backend `FRONTEND_URL` was a placeholder, update it to your frontend URL (e.g. `https://aone-tarot.onrender.com`)
6. Deploy the frontend (Manual Deploy or auto-deploy)

### 3.6 Database Setup

The backend build automatically runs `prisma db push` and `prisma db seed`.  
After the first deploy, your database will have:
- Admin user: `admin@aonetarot.com` / `admin123` (change this in production!)
- Services and pricing options

---

## Step 4: Test Your Deployment

1. Open your frontend URL: `https://aone-tarot.onrender.com`
2. Test:
   - Home page loads
   - Sign up / Login
   - Book a reading
   - Contact form

---

## Step 5: Custom Domain (Optional)

### Frontend

1. In Render, open **aone-tarot**
2. Go to **Settings** → **Custom Domains**
3. Add your domain (e.g. `www.aonetarot.com`)
4. Update DNS as shown in Render

### Backend

1. Open **aone-tarot-api**
2. Add custom domain (e.g. `api.aonetarot.com`)
3. Update `NEXT_PUBLIC_API_URL` in the frontend to the new API URL
4. Update `FRONTEND_URL` in the backend to the new frontend URL

---

## Troubleshooting

### Backend won’t start
- Check `DATABASE_URL` is correct
- Ensure Prisma ran: `npx prisma generate` is in the build command

### Frontend shows “Failed to fetch”
- Confirm `NEXT_PUBLIC_API_URL` is set and matches the backend URL
- Confirm `FRONTEND_URL` on the backend includes your frontend URL

### CORS errors
- Add your frontend URL to `FRONTEND_URL` on the backend
- Render URLs (`*.onrender.com`) are allowed by default

### Database connection failed
- Use the Supabase **Connection string** (URI), not the pooler URL for Prisma
- Ensure the password in the URL is correct and URL-encoded if it has special characters

---

## Summary

| Step | Action |
|------|--------|
| 1 | Push code to GitHub |
| 2 | Create Supabase project, copy `DATABASE_URL` |
| 3 | Render → New Blueprint → Connect AoneTarot repo |
| 4 | Add env vars to **aone-tarot-api** |
| 5 | Add `NEXT_PUBLIC_API_URL` to **aone-tarot** |
| 6 | Update `FRONTEND_URL` on backend with frontend URL |
| 7 | Run `prisma db push` and `prisma db seed` |
| 8 | Test the live site |
