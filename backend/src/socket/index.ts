import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AuthenticatedSocket {
  userId: string;
  role: string;
}

export function setupSocketHandlers(io: Server) {
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Authentication required'));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; email: string };
      (socket as any).user = decoded;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const user = (socket as any).user;

    socket.on('join-booking', async (bookingId: string) => {
      const booking = await prisma.booking.findFirst({
        where: { id: bookingId },
        include: { payment: true },
      });
      if (!booking) return socket.emit('error', { message: 'Booking not found' });
      if (booking.payment?.status !== 'COMPLETED') {
        return socket.emit('error', { message: 'Chat only available after payment' });
      }
      if (booking.userId !== user.userId && user.role !== 'ADMIN') {
        return socket.emit('error', { message: 'Access denied' });
      }
      socket.join(`booking:${bookingId}`);
    });

    socket.on('send-message', async (data: { bookingId: string; content: string }) => {
      const { bookingId, content } = data;
      if (!content?.trim()) return;

      const booking = await prisma.booking.findFirst({
        where: { id: bookingId },
        include: { payment: true },
      });
      if (!booking || booking.payment?.status !== 'COMPLETED') return;
      if (booking.userId !== user.userId && user.role !== 'ADMIN') return;

      const sender = await prisma.user.findUnique({
        where: { id: user.userId },
        select: { id: true, name: true },
      });
      if (!sender) return;

      const message = await prisma.message.create({
        data: {
          bookingId,
          senderId: user.userId,
          content: content.trim(),
        },
        include: { sender: { select: { id: true, name: true } } },
      });

      io.to(`booking:${bookingId}`).emit('new-message', message);
    });

    socket.on('disconnect', () => {});
  });
}
