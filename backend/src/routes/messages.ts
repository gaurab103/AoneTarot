import { Router } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

const sendSchema = z.object({
  bookingId: z.string().cuid(),
  content: z.string().min(1).max(2000),
});

router.get('/:bookingId', authenticate, async (req, res) => {
  const user = (req as any).user;
  const { bookingId } = req.params;

  const booking = await prisma.booking.findFirst({
    where: { id: bookingId },
    include: { payment: true },
  });
  if (!booking) return res.status(404).json({ error: 'Booking not found' });
  if (booking.userId !== user.id && user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Access denied' });
  }
  if (booking.payment?.status !== 'COMPLETED') {
    return res.status(403).json({ error: 'Chat only available after payment' });
  }

  const messages = await prisma.message.findMany({
    where: { bookingId },
    include: { sender: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'asc' },
  });

  res.json(messages);
});

router.post('/', authenticate, async (req, res) => {
  try {
    const data = sendSchema.parse(req.body);
    const user = (req as any).user;

    const booking = await prisma.booking.findFirst({
      where: { id: data.bookingId },
      include: { payment: true },
    });
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    if (booking.userId !== user.id && user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied' });
    }
    if (booking.payment?.status !== 'COMPLETED') {
      return res.status(403).json({ error: 'Chat only available after payment' });
    }

    const message = await prisma.message.create({
      data: {
        bookingId: data.bookingId,
        senderId: user.id,
        content: data.content,
      },
      include: { sender: { select: { id: true, name: true } } },
    });

    res.status(201).json(message);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return res.status(400).json({ error: e.errors[0].message });
    }
    throw e;
  }
});

export const messageRoutes = router;
