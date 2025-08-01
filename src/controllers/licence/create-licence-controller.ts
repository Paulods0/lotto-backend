import type { Request, Response } from 'express';
import { createLicenceService } from '../../services/licence/create-licence.service';
import { createLicenceSchema } from '../../validations/licence-schemas/create-licence-schema';

export async function createLicenceController(req: Request, res: Response) {
  const user = req.user;
  const body = createLicenceSchema.parse({ ...req.body, user });
  const response = await createLicenceService(body);

  return res.status(201).json({
    message: 'Licença criada com sucesso',
    data: response,
  });
}
