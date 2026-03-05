import { Router } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth.js';
import { createPayPalOrder, capturePayPalOrder } from '../lib/paypal.js';
import { sendBookingConfirmation } from '../lib/email.js';

const router = Router();
const prisma = new PrismaClient();

const createOrderSchema = z.object({
  bookingId: z.string().cuid(),
});

router.post('/create-order', authenticate, async (req, res) => {
  try {
    const { bookingId } = createOrderSchema.parse(req.body);
    const user = (req as any).user;

    const booking = await prisma.booking.findFirst({
      where: { id: bookingId, userId: user.id },
      include: { service: true },
    });
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    if (booking.status !== 'PENDING') {
      return res.status(400).json({ error: 'Booking already paid or invalid' });
    }

    const existingPayment = await prisma.payment.findUnique({
      where: { bookingId },
    });
    if (existingPayment?.status === 'COMPLETED') {
      return res.status(400).json({ error: 'Payment already completed' });
    }

    let amount = 0;
    if (booking.serviceOptionId) {
      const opt = await prisma.serviceOption.findUnique({
        where: { id: booking.serviceOptionId },
      });
      amount = opt ? Number(opt.price) : 0;
    } else {
      amount = booking.service?.price ? Number(booking.service.price) : 0;
    }
    if (amount <= 0) return res.status(400).json({ error: 'Invalid booking amount' });
    const orderId = await createPayPalOrder(amount);

    await prisma.payment.upsert({
      where: { bookingId },
      update: { paypalOrderId: orderId, status: 'PENDING' },
      create: {
        userId: user.id,
        bookingId,
        paypalOrderId: orderId,
        amount,
        status: 'PENDING',
      },
    });

    res.json({ orderId });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return res.status(400).json({ error: e.errors[0].message });
    }
    throw e;
  }
});

router.post('/capture', authenticate, async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) return res.status(400).json({ error: 'orderId required' });

    const capture = await capturePayPalOrder(orderId);
    if (capture.status !== 'COMPLETED') {
      return res.status(400).json({ error: 'Payment capture failed' });
    }

    const payment = await prisma.payment.findFirst({
      where: { paypalOrderId: orderId },
      include: { booking: { include: { user: true, service: true } } },
    });
    if (!payment) return res.status(404).json({ error: 'Payment not found' });

    await prisma.$transaction([
      prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'COMPLETED' },
      }),
      prisma.booking.update({
        where: { id: payment.bookingId },
        data: { status: 'SCHEDULED', paymentId: payment.id },
      }),
    ]);

    await sendBookingConfirmation(payment.booking);

    res.json({
      success: true,
      bookingId: payment.bookingId,
      message: 'Payment completed successfully',
    });
  } catch (e) {
    console.error('Capture error:', e);
    res.status(500).json({ error: 'Payment capture failed' });
  }
});

export const paymentRoutes = router;
