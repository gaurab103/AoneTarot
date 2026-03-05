import { Router } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

const createSchema = z.object({
  bookingId: z.string().cuid(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(10).max(1000),
});

router.get('/', async (_req, res) => {
  const reviews = await prisma.review.findMany({
    where: { comment: { not: '' } },
    include: {
      user: { select: { name: true } },
      booking: {
        include: { service: { select: { name: true } } },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
  const withComments = reviews.filter((r) => r.comment && r.comment.trim().length >= 10);
  res.json(
    withComments.map((r) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt,
      userName: r.user.name,
      serviceName: r.booking.service.name,
      verified: true,
    }))
  );
});

router.post('/', authenticate, async (req, res) => {
  try {
    const data = createSchema.parse(req.body);
    const user = (req as any).user;

    const booking = await prisma.booking.findFirst({
      where: { id: data.bookingId, userId: user.id },
    });
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    if (booking.status !== 'COMPLETED') {
      return res.status(400).json({ error: 'Only completed readings can be reviewed' });
    }

    const existing = await prisma.review.findUnique({
      where: {
        userId_bookingId: { userId: user.id, bookingId: data.bookingId },
      },
    });
    if (existing) return res.status(400).json({ error: 'You have already reviewed this reading' });

    const review = await prisma.review.create({
      data: {
        userId: user.id,
        bookingId: data.bookingId,
        rating: data.rating,
        comment: data.comment,
      },
      include: {
        booking: { include: { service: { select: { name: true } } } },
      },
    });

    res.status(201).json(review);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return res.status(400).json({ error: e.errors[0].message });
    }
    throw e;
  }
});

export const reviewRoutes = router;
