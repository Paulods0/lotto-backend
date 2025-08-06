import type { Request, Response } from 'express';
import { AuthPayload } from '../../@types/auth-payload';
import { idSchema } from '../../validations/common/id.schema';
import { deleteUser } from '../../services/user/delete.service';

export async function handle(req: Request, res: Response) {
  const user = req.user as AuthPayload;

  const { id } = idSchema.parse(req.params);

  await deleteUser(id, user);

  return res.status(200).json({
    message: 'Usuário removido com sucesso',
  });
}
