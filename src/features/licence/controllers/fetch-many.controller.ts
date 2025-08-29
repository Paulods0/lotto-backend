import type { Request, Response } from 'express';
import { HttpStatus } from '../../constants/http';
import { AuthPayload } from '../../@types/auth-payload';
import { buildUserAbillity } from '../../permissions/build-abillity';
import { paramsSchema } from '../../validations/common/query.schema';
import { fetchManyLicences } from '../../services/licence/fetch-many.service';

export async function handle(req: Request, res: Response) {
  const user = req.user as AuthPayload;

  const ability = await buildUserAbillity(user.id);

  if (!ability.can('read', 'Licences')) {
    return res.status(HttpStatus.FORBIDDEN).json({ message: 'Você não tem permissão' });
  }

  const query = paramsSchema.parse(req.query);
  const response = await fetchManyLicences(query);

  return res.status(200).json(response);
}
