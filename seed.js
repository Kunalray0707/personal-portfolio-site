import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@portfolify.com' },
    update: {
      role: 'ADMIN',
      passwordHash
    },
    create: {
      email: 'admin@portfolify.com',
      name: 'Admin',
      role: 'ADMIN',
      passwordHash
    }
  });
  console.log('Admin user seeded (admin@portfolify.com / admin123)');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
