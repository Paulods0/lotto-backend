import type { Request, Response } from 'express';
import { AuthPayload } from '../../@types/auth-payload';
import { idSchema } from '../../validations/common/id.schema';
import { deleteTerminal } from '../../services/terminal/delete.service';

export async function handle(req: Request, res: Response) {
  const { id } = idSchema.parse(req.params);
  const user = req.user as AuthPayload;

  await deleteTerminal(id, user);

  return res.status(200).json({
    message: 'Terminal removido com sucesso',
  });
}
