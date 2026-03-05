import nodemailer from 'nodemailer';
import { Booking } from '@prisma/client';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendBookingConfirmation(booking: Booking & { user?: any; service?: any }) {
  if (!process.env.SMTP_USER) {
    console.log('Email not configured, skipping confirmation');
    return;
  }

  const fullBooking = await prisma.booking.findUnique({
    where: { id: booking.id },
    include: { user: true, service: true },
  });
  if (!fullBooking?.user?.email) return;

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

  await transporter.sendMail({
    from: process.env.SMTP_FROM || '"A One Tarot" <noreply@aonetarot.com>',
    to: fullBooking.user.email,
    subject: 'Your Tarot Reading is Confirmed - A One Tarot',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a0f2e;">✨ Your Reading is Confirmed</h2>
        <p>Dear ${fullBooking.user.name},</p>
        <p>Thank you for booking with A One Tarot. Your payment has been received.</p>
        <h3>Booking Details</h3>
        <ul>
          <li><strong>Service:</strong> ${fullBooking.service?.name || 'Tarot Reading'}</li>
          <li><strong>Status:</strong> Scheduled</li>
          <li><strong>Booking ID:</strong> ${fullBooking.id}</li>
        </ul>
        <p>We will contact you shortly to schedule your reading time.</p>
        <p><a href="${frontendUrl}/dashboard" style="background: #d4af37; color: #1a0f2e; padding: 10px 20px; text-decoration: none; border-radius: 8px;">View Dashboard</a></p>
        <p style="color: #666; font-size: 12px;">A One Tarot - Mystical Guidance</p>
      </div>
    `,
  });
}
