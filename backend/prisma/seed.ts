import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@aonetarot.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@aonetarot.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  const yesNoService = await prisma.service.upsert({
    where: { slug: 'yes-no-tarot' },
    update: { price: null },
    create: {
      slug: 'yes-no-tarot',
      name: 'Yes/No Tarot',
      description: 'Quick yes or no answers to your burning questions. Choose how many questions you need.',
      price: null,
    },
  });

  await prisma.serviceOption.upsert({
    where: { slug: 'yes-no-1' },
    update: {},
    create: {
      slug: 'yes-no-1',
      serviceId: yesNoService.id,
      label: '1 Question',
      questionCount: 1,
      price: 4.99,
      sortOrder: 1,
    },
  });
  await prisma.serviceOption.upsert({
    where: { slug: 'yes-no-2' },
    update: {},
    create: {
      slug: 'yes-no-2',
      serviceId: yesNoService.id,
      label: '2 Questions',
      questionCount: 2,
      price: 8.99,
      sortOrder: 2,
    },
  });
  await prisma.serviceOption.upsert({
    where: { slug: 'yes-no-5' },
    update: {},
    create: {
      slug: 'yes-no-5',
      serviceId: yesNoService.id,
      label: '5 Questions',
      questionCount: 5,
      price: 18.99,
      sortOrder: 3,
    },
  });
  await prisma.serviceOption.upsert({
    where: { slug: 'yes-no-7' },
    update: {},
    create: {
      slug: 'yes-no-7',
      serviceId: yesNoService.id,
      label: '7 Questions',
      questionCount: 7,
      price: 24.99,
      sortOrder: 4,
    },
  });

  const detailedService = await prisma.service.upsert({
    where: { slug: 'detailed-reading' },
    update: { price: null },
    create: {
      slug: 'detailed-reading',
      name: 'Detailed Reading',
      description: 'Comprehensive multi-card spread with in-depth interpretation. Choose your depth.',
      price: null,
    },
  });

  await prisma.serviceOption.upsert({
    where: { slug: 'detailed-1' },
    update: {},
    create: {
      slug: 'detailed-1',
      serviceId: detailedService.id,
      label: '1 Question (3-Card Spread)',
      questionCount: 1,
      price: 14.99,
      sortOrder: 1,
    },
  });
  await prisma.serviceOption.upsert({
    where: { slug: 'detailed-2' },
    update: {},
    create: {
      slug: 'detailed-2',
      serviceId: detailedService.id,
      label: '2 Questions (5-Card Spread)',
      questionCount: 2,
      price: 24.99,
      sortOrder: 2,
    },
  });
  await prisma.serviceOption.upsert({
    where: { slug: 'detailed-5' },
    update: {},
    create: {
      slug: 'detailed-5',
      serviceId: detailedService.id,
      label: '5 Questions (Celtic Cross)',
      questionCount: 5,
      price: 49.99,
      sortOrder: 3,
    },
  });
  await prisma.serviceOption.upsert({
    where: { slug: 'detailed-7' },
    update: {},
    create: {
      slug: 'detailed-7',
      serviceId: detailedService.id,
      label: '7 Questions (Full Reading)',
      questionCount: 7,
      price: 64.99,
      sortOrder: 4,
    },
  });

  await prisma.service.upsert({
    where: { slug: 'love-reading' },
    update: {},
    create: {
      slug: 'love-reading',
      name: 'Love Reading',
      description: 'Explore matters of the heart with a specialized love and relationship spread.',
      price: 24.99,
    },
  });
  await prisma.service.upsert({
    where: { slug: 'career-reading' },
    update: {},
    create: {
      slug: 'career-reading',
      name: 'Career Reading',
      description: 'Gain clarity on career path, opportunities, and professional decisions.',
      price: 24.99,
    },
  });

  console.log('Seed completed:', { admin });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
