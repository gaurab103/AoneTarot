import { Router } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

const createSchema = z.object({
  serviceId: z.string().cuid(),
  serviceOptionId: z.string().cuid().optional(),
  scheduledAt: z.string().datetime().optional(),
});

router.get('/', authenticate, async (req, res) => {
  const user = (req as any).user;
  const bookings = await prisma.booking.findMany({
    where: { userId: user.id },
    include: {
      service: { select: { name: true, slug: true, price: true } },
      payment: { select: { status: true, amount: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
  res.json(bookings);
});

router.post('/', authenticate, async (req, res) => {
  try {
    const data = createSchema.parse(req.body);
    const user = (req as any).user;

    const service = await prisma.service.findUnique({
      where: { id: data.serviceId },
      include: { options: true },
    });
    if (!service) return res.status(404).json({ error: 'Service not found' });

    if (service.options.length > 0 && !data.serviceOptionId) {
      return res.status(400).json({ error: 'Please select a pricing option' });
    }
    if (data.serviceOptionId) {
      const opt = service.options.find((o) => o.id === data.serviceOptionId);
      if (!opt) return res.status(400).json({ error: 'Invalid pricing option' });
    }

    const booking = await prisma.booking.create({
      data: {
        userId: user.id,
        serviceId: data.serviceId,
        serviceOptionId: data.serviceOptionId ?? null,
        status: 'PENDING',
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
      },
      include: {
        service: { select: { name: true, slug: true, price: true } },
      },
    });

    res.status(201).json(booking);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return res.status(400).json({ error: e.errors[0].message });
    }
    throw e;
  }
});

router.get('/:id', authenticate, async (req, res) => {
  const user = (req as any).user;
  const booking = await prisma.booking.findFirst({
    where: { id: req.params.id, userId: user.id },
    include: {
      service: true,
      payment: true,
    },
  });
  if (!booking) return res.status(404).json({ error: 'Booking not found' });
  res.json(booking);
});

export const bookingRoutes = router;
