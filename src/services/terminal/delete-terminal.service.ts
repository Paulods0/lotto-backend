import { NotFoundError } from '../../errors';
import prisma from '../../lib/prisma';
import deleteKeysByPattern from '../../utils/redis';

export async function deleteTerminalService(id: string) {

  const terminal = await prisma.terminal.findUnique({ where: { id } });

  if (!terminal) throw new NotFoundError('Terminal não encontrado.');

  await prisma.terminal.delete({ where: { id } });

  // await prisma.auditLog.create({
  //   data: {
  //     entity_id: id,
  //     action: 'delete',
  //     entity: 'terminal',
  //     metadata: {
  //       data: terminal,
  //     },
  //     user_id: data.user.id,
  //     user_name: data.user.name,
  //   },
  // });
  try {
    await deleteKeysByPattern('terminals:*');
  } catch (error) {
    console.warn('Erro ao limpar o redis', error);
  }
}
