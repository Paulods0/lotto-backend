import type { Request, Response } from 'express';
import { AuthPayload } from '../../@types/auth-payload';
import { createLicence } from '../../services/licence/create.service';
import { createLicenceSchema } from '../../validations/licence/create.schema';

export async function handle(req: Request, res: Response) {
  const user = req.user as AuthPayload;
  const body = createLicenceSchema.parse({ ...req.body, user });
  const response = await createLicence(body);

  return res.status(201).json({
    message: 'Licença criada com sucesso',
    data: response,
  });
}
