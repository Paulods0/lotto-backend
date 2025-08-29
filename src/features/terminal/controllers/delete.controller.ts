import type { Request, Response } from 'express';
import { AuthPayload } from '../../@types/auth-payload';
import { idSchema } from '../../validations/common/id.schema';
import { deleteTerminal } from '../../services/terminal/delete.service';
import { HttpStatus } from '../../constants/http';
import { buildUserAbillity } from '../../permissions/build-abillity';

export async function handle(req: Request, res: Response) {
  const user = req.user as AuthPayload;

  const ability = await buildUserAbillity(user.id);

  if (!ability.can('delete', 'Terminals')) {
    return res.status(HttpStatus.FORBIDDEN).json({ message: 'Você não tem permissão' });
  }

  const { id } = idSchema.parse(req.params);

  await deleteTerminal(id, user);

  return res.status(200).json({
    message: 'Terminal removido com sucesso',
  });
}
