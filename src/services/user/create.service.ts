import bcrypt from 'bcrypt';
import prisma from '../../lib/prisma';
import { ConflictError } from '../../errors';
import { audit } from '../../utils/audit-log';
import { RedisKeys } from '../../utils/redis/keys';
import { deleteCache } from '../../utils/redis/delete-cache';
import { CreateUserDTO } from '../../validations/user/create.schema';

export async function createUser({ user, ...data }: CreateUserDTO) {
  const existingUser = await prisma.user.findUnique({ where: { email: data.email } });

  if (existingUser) throw new ConflictError('Já existe um usuário com este email.');

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = await bcrypt.hash(data.password, salt);

  await prisma.$transaction(async tx => {
    const newUser = await tx.user.create({
      data: {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        role: data.role,
        password: hashedPassword,
      },
    });

    const { id, created_at, password, ...rest } = newUser;

    await audit(tx, 'create', {
      entity: 'user',
      user,
      before: null,
      after: newUser,
    });
  });
  await Promise.all([deleteCache(RedisKeys.users.all()), deleteCache(RedisKeys.auditLogs.all())]);
}
