import type { Request, Response } from 'express';
import { AuthPayload } from '../../../@types/auth-payload';
import { HttpStatus } from '../../../constants/http';
import { buildUserAbillity } from '../../../permissions/build-abillity';
import { createLicenceSchema } from '../schemas/create-licence.schema';
import { createLicence } from '../services';

export async function createLicenceController(req: Request, res: Response) {
  const user = req.user as AuthPayload;

  const ability = await buildUserAbillity(user.id);

  if (!ability.can('write', 'Licences')) {
    return res.status(HttpStatus.FORBIDDEN).json({ message: 'Você não tem permissão' });
  }

  const body = createLicenceSchema.parse({ ...req.body, user });
  const response = await createLicence(body);

  return res.status(201).json({
    message: 'Licença criada com sucesso',
    data: response,
  });
}
