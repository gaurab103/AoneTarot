import { createServer } from 'http';
import { Server } from 'socket.io';
import app from './app';
import { setupSocketHandlers } from './socket/index';

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
      const ok = ioOrigins.some((o) => origin === o || origin.startsWith(o.replace(/\/$/, '') + '/'))
        || origin.endsWith('.vercel.app')
        || origin.endsWith('.onrender.com');
      cb(null, ok);
    },
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

setupSocketHandlers(io);

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`🚀 A One Tarot API running on port ${PORT}`);
});

export { io };
