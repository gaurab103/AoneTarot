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

## Deploy Everything at Once (Render)

**Single push deploys both frontend and backend.**

1. Push to [GitHub](https://github.com/gaurab103/AoneTarot)
2. Go to [render.com](https://render.com) → **New** → **Blueprint**
3. Connect `gaurab103/AoneTarot` repo
4. Render reads `render.yaml` and creates both services
5. Add env vars in Render Dashboard:
   - **aone-tarot-api**: `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL` (frontend URL after deploy), `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`
   - **aone-tarot**: `NEXT_PUBLIC_API_URL` (api URL, e.g. `https://aone-tarot-api.onrender.com`)
6. Deploy both

## Deploy to Vercel (Frontend only)

1. [vercel.com](https://vercel.com) → New Project → Import `gaurab103/AoneTarot`
2. **Root Directory**: `frontend`
3. **Env**: `NEXT_PUBLIC_API_URL` = your backend URL
4. Deploy (backend must be on Railway/Render)

### CORS

Set `FRONTEND_URL` on the backend to your frontend URL. Backend allows `*.vercel.app` and `*.onrender.com` automatically.

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
