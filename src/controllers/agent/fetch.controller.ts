import { Request, Response } from 'express';
import { paramsSchema } from '../../validations/common/query.schema';
import { fetchManyAgents } from '../../services/agent/fetch-many.service';
import { buildUserAbillity } from '../../permissions/build-abillity';
import { AuthPayload } from '../../@types/auth-payload';
import { HttpStatus } from '../../constants/http';

export async function handle(req: Request, res: Response) {
  const user = req.user as AuthPayload;

  const abillity = await buildUserAbillity(user.id);

  if (!abillity.can('read', 'Agents')) {
    return res.status(HttpStatus.FORBIDDEN).json({ message: 'Você não tem permissão.' });
  }

  const query = paramsSchema.parse(req.query);

  const response = await fetchManyAgents(query);

  return res.status(200).json(response);
}
