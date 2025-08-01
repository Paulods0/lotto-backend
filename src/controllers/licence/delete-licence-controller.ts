import type { Request, Response } from 'express';
import { idSchema } from '../../validations/@common/id.schema';
import { deleteLicenceService } from '../../services/licence/delete-licence.service';

export async function deleteLicenceController(req: Request, res: Response) {
  const user = req.user;

  const { id } = idSchema.parse(req.params);

  await deleteLicenceService(id);

  return res.status(200).json({
    message: 'Licença removida com sucesso.',
  });
}
