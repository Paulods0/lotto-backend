import app from '../src';
import bcrypt from 'bcrypt';
import request from 'supertest';
import prisma from '../src/lib/prisma';
import { randomUUID } from 'node:crypto';
import { execSync } from 'node:child_process';

export let token: string;
export let userId: string;
export let adminId: number;
export let provinceId: number;
export let cityId: number;

beforeAll(async () => {
  execSync('yarn prisma migrate deploy', { stdio: 'inherit' });
});

beforeEach(async () => {
  await prisma.membership.deleteMany();
  await prisma.groupPermission.deleteMany();
  await prisma.group.deleteMany();
  await prisma.pos.deleteMany();
  await prisma.city.deleteMany();
  await prisma.province.deleteMany();
  await prisma.administration.deleteMany();
  await prisma.idReference.deleteMany();

  await prisma.agent.deleteMany();
  await prisma.simCard.deleteMany();
  await prisma.terminal.deleteMany();
  await prisma.licence.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.area.deleteMany();
  await prisma.zone.deleteMany();
  await prisma.type.deleteMany();
  await prisma.subtype.deleteMany();

  await prisma.user.deleteMany();

  const email = `p.luguenda-${randomUUID()}@lotarianacional.co.ao`;
  const password = 'msftsrep0.';
  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      first_name: 'Paulo',
      last_name: 'Luguenda',
      email,
      role: 'dev',
      password: hashed,
    },
  });

  userId = user.id;

  const admin = await prisma.administration.create({
    data: {
      name: 'maianga',
    },
  });

  adminId = admin.id;

  await prisma.idReference.createMany({
    data: [
      {
        counter: 1000,
        type: 'revendedor',
      },
      {
        counter: 9000,
        type: 'lotaria_nacional',
      },
    ],
  });

  const province = await prisma.province.create({ data: { name: 'Luanda' } });
  const city = await prisma.city.create({ data: { name: 'Luanda', province_id: province.id } });

  provinceId = province.id;
  cityId = city.id;

  const loginRes = await request(app).post('/api/auth/login').send({
    email,
    password,
  });

  token = loginRes.body.accessToken;
});

afterAll(async () => await prisma.$disconnect());
