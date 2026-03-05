import { Router } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

router.use(authenticate, requireAdmin);

router.get('/bookings', async (_req, res) => {
  const bookings = await prisma.booking.findMany({
    include: {
      user: { select: { id: true, name: true, email: true } },
      service: { select: { name: true, slug: true, price: true } },
      payment: { select: { status: true, amount: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
  res.json(bookings);
});

router.patch('/bookings/:id', async (req, res) => {
  const schema = z.object({
    status: z.enum(['PENDING', 'SCHEDULED', 'COMPLETED', 'CANCELLED']).optional(),
    scheduledAt: z.string().datetime().optional(),
  });
  const data = schema.parse(req.body);
  const booking = await prisma.booking.update({
    where: { id: req.params.id },
    data: {
      ...data,
      scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined,
    },
    include: {
      user: { select: { name: true, email: true } },
      service: { select: { name: true } },
    },
  });
  res.json(booking);
});

router.get('/reviews', async (_req, res) => {
  const reviews = await prisma.review.findMany({
    include: {
      user: { select: { name: true } },
      booking: { include: { service: { select: { name: true } } } },
    },
    orderBy: { createdAt: 'desc' },
  });
  res.json(reviews);
});

router.get('/analytics', async (_req, res) => {
  const [totalRevenue, bookingCounts, last30Days] = await Promise.all([
    prisma.payment.aggregate({
      where: { status: 'COMPLETED' },
      _sum: { amount: true },
    }),
    prisma.booking.groupBy({
      by: ['status'],
      _count: true,
    }),
    prisma.payment.findMany({
      where: {
        status: 'COMPLETED',
        createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      },
      select: { amount: true, createdAt: true },
    }),
  ]);

  const byMonth = last30Days.reduce((acc: Record<string, number>, p) => {
    const key = p.createdAt.toISOString().slice(0, 7);
    acc[key] = (acc[key] || 0) + Number(p.amount);
    return acc;
  }, {});

  res.json({
    totalRevenue: Number(totalRevenue._sum.amount || 0),
    monthlyRevenue: Object.entries(byMonth).map(([month, amount]) => ({ month, amount })),
    bookingCounts: Object.fromEntries(bookingCounts.map((b) => [b.status, b._count])),
  });
});

const serviceSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  price: z.number().positive(),
  slug: z.string().min(1).optional(),
});

router.get('/services', async (_req, res) => {
  const services = await prisma.service.findMany({ orderBy: { createdAt: 'asc' } });
  res.json(services);
});

router.post('/services', async (req, res) => {
  const data = serviceSchema.parse(req.body);
  const slug = data.slug || data.name.toLowerCase().replace(/\s+/g, '-');
  const service = await prisma.service.create({
    data: { ...data, slug },
  });
  res.status(201).json(service);
});

router.patch('/services/:id', async (req, res) => {
  const data = serviceSchema.partial().parse(req.body);
  const service = await prisma.service.update({
    where: { id: req.params.id },
    data,
  });
  res.json(service);
});

router.delete('/services/:id', async (req, res) => {
  await prisma.service.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

export const adminRoutes = router;
