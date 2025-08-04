import type { Request, Response } from 'express';
import { AuthPayload } from '../../@types/auth-payload';
import { idSchema } from '../../validations/@common/id.schema';
import { updateLicenceService } from '../../services/licence/update-licence.service';
import { updateLicenceSchema } from '../../validations/licence-schemas/update-licence-schema';

export async function updateLicenceController(req: Request, res: Response) {
  const user = req.user as AuthPayload;

  const { id } = idSchema.parse(req.params);
  const body = updateLicenceSchema.parse({ ...req.body, id, user });

  const response = await updateLicenceService(body);

  return res.status(200).json({
    message: 'Licença atualizada com sucesso',
    data: response,
  });
}
