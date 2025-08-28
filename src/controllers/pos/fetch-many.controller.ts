import type { Request, Response } from 'express';
import { paramsSchema } from '../../validations/common/query.schema';
import { fetchManyPos } from '../../services/pos/fetch-many-pos.service';
import { AuthPayload } from '../../@types/auth-payload';
import { HttpStatus } from '../../constants/http';
import { buildUserAbillity } from '../../permissions/build-abillity';

export async function handle(req: Request, res: Response) {
  const user = req.user as AuthPayload;

  const ability = await buildUserAbillity(user.id);

  if (!ability.can('read', 'Pos')) {
    return res.status(HttpStatus.FORBIDDEN).json({ message: 'Você não tem permissão' });
  }

  const query = paramsSchema.parse(req.query);

  const result = await fetchManyPos(query);

  return res.status(200).json(result);
}
