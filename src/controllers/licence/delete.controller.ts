import type { Request, Response } from 'express';
import { AuthPayload } from '../../@types/auth-payload';
import { idSchema } from '../../validations/common/id.schema';
import { deleteLicence } from '../../services/licence/delete.service';

export async function handle(req: Request, res: Response) {
  const { id } = idSchema.parse(req.params);

  const user = req.user as AuthPayload;

  await deleteLicence(id, user);

  return res.status(200).json({
    message: 'Licença removida com sucesso.',
  });
}
