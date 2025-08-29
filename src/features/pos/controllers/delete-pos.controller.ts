import type { Request, Response } from 'express';
import { AuthPayload } from '../../../@types/auth-payload';
import { buildUserAbillity } from '../../../permissions/build-abillity';
import { HttpStatus } from '../../../constants/http';
import { idSchema } from '../../../schemas/common/id.schema';
import { deletePosService } from '../services';

export async function deletePosController(req: Request, res: Response) {
  const user = req.user as AuthPayload;

  const ability = await buildUserAbillity(user.id);

  if (!ability.can('delete', 'Pos')) {
    return res.status(HttpStatus.FORBIDDEN).json({ message: 'Você não tem permissão' });
  }

  const { id } = idSchema.parse(req.params);

  await deletePosService(id, user);

  return res.status(200).json({
    message: 'Pos removido com sucesso',
  });
}
