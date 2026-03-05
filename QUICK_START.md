# Quick Start - A One Tarot

## Step 1: Set Up Database (5 minutes)

You need a PostgreSQL database. **Easiest: Supabase (free)**

1. Go to **[supabase.com](https://supabase.com)** → Sign up (free)
2. **New Project** → Name: `aone-tarot` → Set a **database password** (save it!)
3. Wait for project to be ready (~2 min)
4. Go to **Project Settings** (gear) → **Database**
5. Under **Connection string** → **URI** → Copy it
6. Replace `[YOUR-PASSWORD]` in the URI with your database password
7. Add `?sslmode=require` at the end if not there

**Example:** `postgresql://postgres.abcdef:MyPassword123@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require`

8. Open `backend\.env` and paste your URL as `DATABASE_URL`:
   ```
   DATABASE_URL="your-copied-connection-string-here"
   ```

---

## Step 2: Run Database Setup

Open a terminal in the project folder and run:

```powershell
cd backend
npx prisma db push
npm run db:seed
```

You should see "Seed completed" - that creates the admin user and tarot services.

---

## Step 3: Start the App

**Terminal 1 - Backend:**
```powershell
cd backend
npm run dev
```
Wait for: `🚀 A One Tarot API running on port 4000`

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```

---

## Step 4: Open the App

- **Website:** http://localhost:3000
- **Admin login:** `admin@aonetarot.com` / `admin123`

---

## Optional: PayPal (for payments)

To test payments, get sandbox credentials from [developer.paypal.com](https://developer.paypal.com):

1. Create app in Sandbox
2. Add to `backend\.env`: `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`
3. Add to `frontend\.env.local`: `NEXT_PUBLIC_PAYPAL_CLIENT_ID`

Without PayPal, booking flow works but payment will fail at checkout.
