import { Request, Response } from 'express';
import { AuthPayload } from '../../../@types/auth-payload';
import { HttpStatus } from '../../../constants/http';
import { buildUserAbillity } from '../../../permissions/build-abillity';
import { paramsSchema } from '../../../validations/common/query.schema';
import { fetchManyAgents } from '../services/fetch-many-agents.service';

export async function fetchManyAgentsController(req: Request, res: Response) {
  const user = req.user as AuthPayload;

  const abillity = await buildUserAbillity(user.id);

  if (!abillity.can('read', 'Agents')) {
    return res.status(HttpStatus.FORBIDDEN).json({ message: 'Você não tem permissão.' });
  }

  const query = paramsSchema.parse(req.query);

  const response = await fetchManyAgents(query);

  return res.status(200).json(response);
}
