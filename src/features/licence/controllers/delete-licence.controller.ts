import type { Request, Response } from 'express';
import { AuthPayload } from '../../../@types/auth-payload';
import { HttpStatus } from '../../../constants/http';
import { buildUserAbillity } from '../../../permissions/build-abillity';
import { idSchema } from '../../../schemas/common/id.schema';
import { deleteLicence } from '../services';

export async function deleteLicenceController(req: Request, res: Response) {
  const user = req.user as AuthPayload;

  const ability = await buildUserAbillity(user.id);

  if (!ability.can('delete', 'Licences')) {
    return res.status(HttpStatus.FORBIDDEN).json({ message: 'Você não tem permissão' });
  }

  const { id } = idSchema.parse(req.params);

  await deleteLicence(id, user);

  return res.status(200).json({
    message: 'Licença removida com sucesso.',
  });
}
