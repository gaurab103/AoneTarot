import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { authRoutes } from './routes/auth';
import { serviceRoutes } from './routes/services';
import { bookingRoutes } from './routes/bookings';
import { paymentRoutes } from './routes/payments';
import { reviewRoutes } from './routes/reviews';
import { messageRoutes } from './routes/messages';
import { adminRoutes } from './routes/admin';
import { contactRoutes } from './routes/contact';

const app = express();

const defaultOrigin = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
const allowedOrigins = (process.env.FRONTEND_URL || defaultOrigin)
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);
if (!allowedOrigins.length) allowedOrigins.push('http://localhost:3000');

app.use(helmet({ contentSecurityPolicy: false }));
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      const fromList = allowedOrigins.some((o) => origin === o || origin.startsWith(o.replace(/\/$/, '') + '/'));
      const isAllowed = origin.endsWith('.vercel.app') || origin.endsWith('.onrender.com');
      cb(null, fromList || isAllowed);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' },
});
app.use(limiter);
app.use(express.json());

app.get('/api/health', (_, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);

app.use((err: Error, _req: express.Request, res: express.Response) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;
