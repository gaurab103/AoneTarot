import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { authRoutes } from './routes/auth.js';
import { serviceRoutes } from './routes/services.js';
import { bookingRoutes } from './routes/bookings.js';
import { paymentRoutes } from './routes/payments.js';
import { reviewRoutes } from './routes/reviews.js';
import { messageRoutes } from './routes/messages.js';
import { adminRoutes } from './routes/admin.js';
import { setupSocketHandlers } from './socket/index.js';

const app = express();
const httpServer = createServer(app);

const ioOrigins = (process.env.FRONTEND_URL || 'http://localhost:3000')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);
if (!ioOrigins.length) ioOrigins.push('http://localhost:3000');
const io = new Server(httpServer, {
  cors: {
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      const ok = ioOrigins.some((o) => origin === o || origin.startsWith(o.replace(/\/$/, '') + '/')) || origin.endsWith('.vercel.app');
      cb(null, ok);
    },
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Security middleware
app.use(helmet({ contentSecurityPolicy: false }));
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:3000')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);
if (allowedOrigins.length === 0) allowedOrigins.push('http://localhost:3000');
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      const fromList = allowedOrigins.some((o) => origin === o || origin.startsWith(o.replace(/\/$/, '') + '/'));
      const isVercel = origin.endsWith('.vercel.app');
      cb(null, fromList || isVercel);
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

// Health check
app.get('/api/health', (_, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/admin', adminRoutes);

// Socket.io
setupSocketHandlers(io);

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`🚀 A One Tarot API running on port ${PORT}`);
});

export { io };
