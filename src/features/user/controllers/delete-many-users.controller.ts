import type { Request, Response } from 'express';
import { AuthPayload } from '../../../@types/auth-payload';
import { idSchema } from '../../../schemas/common/id.schema';
import { deleteManyUsersService } from '../services';

export async function deleteManyUserController(req: Request, res: Response) {
  const user = req.user as AuthPayload;

  const { id } = idSchema.parse(req.params);

  await deleteManyUsersService(id, user);

  return res.status(200).json({
    message: 'Usuário removido com sucesso',
  });
}
