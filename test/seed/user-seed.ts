import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashed = await bcrypt.hash('password-test', 10);
  const userEmail = 'test@lotarianacional.co.ao';

  await prisma.user.upsert({
    where: { email: userEmail },
    update: {},
    create: {
      first_name: 'test',
      last_name: 'lotaria',
      email: userEmail,
      role: 'dev',
      password: hashed,
    },
  });
}

main().finally(() => prisma.$disconnect());
