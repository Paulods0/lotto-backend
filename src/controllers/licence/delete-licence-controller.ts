import type { Request, Response } from 'express';
import { AuthPayload } from '../../@types/auth-payload';
import { idSchema } from '../../validations/@common/id.schema';
import { deleteLicenceService } from '../../services/licence/delete-licence.service';

export async function deleteLicenceController(req: Request, res: Response) {
  const { id } = idSchema.parse(req.params);

  const user = req.user as AuthPayload;

  await deleteLicenceService(id, user);

  return res.status(200).json({
    message: 'Licença removida com sucesso.',
  });
}
