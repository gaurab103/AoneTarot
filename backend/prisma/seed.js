"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    const hashedPassword = await bcryptjs_1.default.hash('admin123', 12);
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
    const services = await Promise.all([
        prisma.service.upsert({
            where: { slug: 'yes-no-tarot' },
            update: {},
            create: {
                slug: 'yes-no-tarot',
                name: 'Yes/No Tarot',
                description: 'Quick yes or no answer to your burning question. Perfect for quick guidance.',
                price: 9.99,
            },
        }),
        prisma.service.upsert({
            where: { slug: 'detailed-reading' },
            update: {},
            create: {
                slug: 'detailed-reading',
                name: 'Detailed Reading',
                description: 'Comprehensive multi-card spread with in-depth interpretation and guidance.',
                price: 29.99,
            },
        }),
        prisma.service.upsert({
            where: { slug: 'love-reading' },
            update: {},
            create: {
                slug: 'love-reading',
                name: 'Love Reading',
                description: 'Explore matters of the heart with a specialized love and relationship spread.',
                price: 24.99,
            },
        }),
        prisma.service.upsert({
            where: { slug: 'career-reading' },
            update: {},
            create: {
                slug: 'career-reading',
                name: 'Career Reading',
                description: 'Gain clarity on career path, opportunities, and professional decisions.',
                price: 24.99,
            },
        }),
    ]);
    console.log('Seed completed:', { admin, services });
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
