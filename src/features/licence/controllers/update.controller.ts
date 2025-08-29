import type { Request, Response } from 'express';
import { HttpStatus } from '../../constants/http';
import { AuthPayload } from '../../@types/auth-payload';
import { idSchema } from '../../validations/common/id.schema';
import { updateLicence } from '../../services/licence/update.service';
import { updateLicenceSchema } from '../../validations/licence/update.schema';
import { buildUserAbillity } from '../../permissions/build-abillity';

export async function handle(req: Request, res: Response) {
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
