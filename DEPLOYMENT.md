# A One Tarot - Deployment Guide

## Architecture Overview

- **Frontend**: Next.js 14 (Vercel)
- **Backend**: Express + TypeScript (Railway/Render)
- **Database**: PostgreSQL (Supabase/Neon)
- **Real-time**: Socket.io

---

## 1. Database Setup (Supabase or Neon)

1. Create a PostgreSQL database
2. Copy the connection string (use `?sslmode=require` for Supabase/Neon)
3. Add to backend `.env` as `DATABASE_URL`

---

## 2. Backend Deployment (Railway/Render)

### Railway

1. Create new project
2. Connect GitHub repo
3. Set root directory to `backend`
4. Add environment variables:
   - `DATABASE_URL`
   - `JWT_SECRET` (generate: `openssl rand -base64 32`)
   - `FRONTEND_URL` (your Vercel URL, e.g. `https://aone-tarot.vercel.app`)
   - `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`
   - `PAYPAL_LIVE=true` for production
5. Build command: `npm run build`
6. Start command: `npm start`
7. Run migrations: Add a one-off command or use Railway's shell:
   ```bash
   npx prisma migrate deploy
   npm run db:seed
   ```

### Render

1. New Web Service
2. Connect repo, set root to `backend`
3. Build: `npm install && npm run build`
4. Start: `npm start`
5. Add environment variables (same as above)

---

## 3. Frontend Deployment (Vercel)

1. Import project from GitHub
2. Set root directory to `frontend`
3. Environment variables:
   - `NEXT_PUBLIC_API_URL` = your backend URL (e.g. `https://your-backend.railway.app`)
   - `NEXT_PUBLIC_PAYPAL_CLIENT_ID`
4. Deploy

---

## 4. PayPal Setup

1. Create PayPal Developer account
2. Create App in Sandbox (dev) or Live (prod)
3. Get Client ID and Secret
4. For production: Use Live credentials and set `PAYPAL_LIVE=true`
5. Add webhook URL for payment verification (optional, for extra security)

---

## 5. Logo

Place your logo at `frontend/public/logo.png` (recommended: 56x56px or larger, PNG format).
The header will display it. If missing, a fallback symbol (✦) is shown.

---

## 6. Post-Deploy Checklist

- [ ] Database migrated (`prisma migrate deploy`)
- [ ] Seed run (`npm run db:seed`) - creates admin user & services
- [ ] CORS: Backend `FRONTEND_URL` matches Vercel URL
- [ ] PayPal: Use Live credentials in production
- [ ] Admin login: `admin@aonetarot.com` / `admin123` (change password!)
