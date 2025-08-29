import type { Request, Response } from 'express';
import { AuthPayload } from '../../../@types/auth-payload';
import { HttpStatus } from '../../../constants/http';
import { buildUserAbillity } from '../../../permissions/build-abillity';
import { idSchema } from '../../../schemas/common/id.schema';
import { updateLicenceSchema } from '../schemas/update-licence.schema';
import { updateLicence } from '../services';

export async function updateLicenceController(req: Request, res: Response) {
  const user = req.user as AuthPayload;

  const ability = await buildUserAbillity(user.id);

  if (!ability.can('update', 'Licences')) {
    return res.status(HttpStatus.FORBIDDEN).json({ message: 'Você não tem permissão' });
  }

  const { id } = idSchema.parse(req.params);
  const body = updateLicenceSchema.parse({ ...req.body, id, user });

  const response = await updateLicence(body);

  return res.status(200).json({
    message: 'Licença atualizada com sucesso',
    data: response,
  });
}
