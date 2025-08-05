import bcrypt from 'bcrypt';
import prisma from '../../lib/prisma';
import { ConflictError } from '../../errors';
import { deleteCache } from '../../utils/redis';
import { RedisKeys } from '../../utils/cache-keys/keys';
import { CreateUserDTO } from '../../validations/user/create-user-schema';
import { createAuditLogService } from '../audit-log/create-audit-log-service';

export async function createUserService({ user, ...data }: CreateUserDTO) {
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

    await createAuditLogService(tx, {
      action: 'CREATE',
      entity: 'USER',
      user_name: user.name,
      entity_id: newUser.id,
      user_id: user.id,
      metadata: rest,
    });
  });

  await deleteCache(RedisKeys.users.all());
}
