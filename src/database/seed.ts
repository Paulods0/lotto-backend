import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedData() {
  try {
    await prisma.type.createMany({
      data: [{ name: 'ambulante' }, { name: 'popup-kit' }, { name: 'agencias' }, { name: 'comercio' }],
    });
    console.log('Database seeded successfuly.');
  } catch (error) {
    console.error('Error while generate seed.');
  } finally {
    prisma.$disconnect();
  }
}

seedData();
