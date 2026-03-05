import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (_req, res) => {
  const services = await prisma.service.findMany({
    orderBy: { createdAt: 'asc' },
    include: {
      options: {
        orderBy: { sortOrder: 'asc' },
        select: {
          id: true,
          slug: true,
          label: true,
          questionCount: true,
          price: true,
        },
      },
    },
    select: {
      id: true,
      slug: true,
      name: true,
      description: true,
      price: true,
      options: true,
    },
  });
  res.json(services);
});

router.get('/:slug', async (req, res) => {
  const service = await prisma.service.findUnique({
    where: { slug: req.params.slug },
    include: {
      options: { orderBy: { sortOrder: 'asc' } },
    },
  });
  if (!service) return res.status(404).json({ error: 'Service not found' });
  res.json(service);
});

export const serviceRoutes = router;
