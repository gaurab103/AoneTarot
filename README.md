# A One Tarot

Professional tarot reading platform with Next.js 14 frontend and Express backend.

## Features

- **PWA** – Install on home screen, offline support
- **Dark/Light mode** – Theme toggle
- **Responsive** – Mobile-first design
- **Real reviews** – Client-written testimonials only
- **PayPal** – Secure payments
- **Live chat** – Socket.io messaging

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind, Framer Motion, Zustand
- **Backend**: Express, Prisma, PostgreSQL (Supabase), JWT, Socket.io

## Local Development

### Prerequisites

- Node.js 18+
- PostgreSQL (or Supabase)

### Setup

1. **Clone & install**
   ```bash
   git clone https://github.com/gaurab103/AoneTarot.git
   cd AoneTarot
   ```

2. **Backend**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env: DATABASE_URL, JWT_SECRET, PAYPAL_*, etc.
   npm install
   npx prisma generate
   npx prisma db push
   npm run db:seed
   npm run dev
   ```

3. **Frontend**
   ```bash
   cd frontend
   cp .env.local.example .env.local
   # Set NEXT_PUBLIC_API_URL=http://localhost:4000
   npm install
   npm run dev
   ```

- Frontend: http://localhost:3000  
- Backend: http://localhost:4000  

## Deploy to Vercel

### Frontend (Vercel)

1. Push code to [GitHub](https://github.com/gaurab103/AoneTarot)
2. Go to [vercel.com](https://vercel.com) → New Project → Import `gaurab103/AoneTarot`
3. **Root Directory**: `frontend` (or leave as-is if using `vercel.json`)
4. **Environment Variables**:
   - `NEXT_PUBLIC_API_URL` = your backend URL (e.g. `https://your-backend.railway.app`)
5. Deploy

### Backend (Railway / Render)

The backend must be deployed separately (Vercel is for frontend only).

**Railway**

1. [railway.app](https://railway.app) → New Project → Deploy from GitHub
2. Select `backend` folder or set root to `backend`
3. Add env vars: `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL` (your Vercel URL), `PAYPAL_*`
4. Add PostgreSQL or connect Supabase
5. Build: `npm run build` | Start: `npm start`

**Render**

1. [render.com](https://render.com) → New Web Service
2. Connect repo, set root to `backend`
3. Build: `npm install && npx prisma generate && npm run build`
4. Start: `npm start`
5. Add env vars

### CORS

Set `FRONTEND_URL` on the backend to your Vercel URL, e.g.:
```
FRONTEND_URL=https://aone-tarot.vercel.app
```
Multiple origins: `https://aone-tarot.vercel.app,https://aone-tarot-git-main.vercel.app`

## Project Structure

```
AoneTarot/
├── frontend/          # Next.js 14 (Vercel)
├── backend/           # Express API (Railway/Render)
├── vercel.json        # Vercel config
└── README.md
```

## License

Private – A One Tarot
