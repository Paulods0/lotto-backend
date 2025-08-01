import prisma from '../../lib/prisma';
import { NotFoundError } from '../../errors';
import deleteKeysByPattern from '../../utils/redis';

export async function deleteUserService(id: string) {
  const existingUser = await prisma.user.findUnique({ where: { id } });
  if (!existingUser) {
    throw new NotFoundError('Usuário não econtrado.');
  }

  await prisma.user.delete({
    where: { id },
  });
  

 try {
    await deleteKeysByPattern('users:*');
  } catch (error) {
      console.warn('Erro ao limpar o redis', error)
  }
}
