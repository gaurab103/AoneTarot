import { Router } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  message: z.string().min(10).max(2000),
});

router.post('/', async (req, res) => {
  try {
    const data = contactSchema.parse(req.body);
    await prisma.contact.create({
      data: { name: data.name, email: data.email, message: data.message },
    });
    res.status(201).json({ message: 'Thank you for your message. We will get back to you soon.' });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return res.status(400).json({ error: e.errors[0].message });
    }
    throw e;
  }
});

export const contactRoutes = router;
