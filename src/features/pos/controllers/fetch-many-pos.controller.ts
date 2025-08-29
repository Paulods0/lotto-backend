import type { Request, Response } from 'express';
import { AuthPayload } from '../../../@types/auth-payload';
import { HttpStatus } from '../../../constants/http';
import { buildUserAbillity } from '../../../permissions/build-abillity';
import { paramsSchema } from '../../../schemas/common/query.schema';
import { fetchManyPos } from '../services/fetch-many-pos.service';

export async function fetchManyPosController(req: Request, res: Response) {
  const user = req.user as AuthPayload;

  const ability = await buildUserAbillity(user.id);

  if (!ability.can('read', 'Pos')) {
    return res.status(HttpStatus.FORBIDDEN).json({ message: 'Você não tem permissão' });
  }

  const query = paramsSchema.parse(req.query);

  const result = await fetchManyPos(query);

  return res.status(200).json(result);
}
