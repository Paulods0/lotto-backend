import type { Request, Response } from 'express';
import { idSchema } from '../../validations/common/id.schema';
import { getAgent } from '../../services/agent/get.service';
import { AuthPayload } from '../../@types/auth-payload';
import { buildUserAbillity } from '../../permissions/build-abillity';
import { HttpStatus } from '../../constants/http';

export async function handle(req: Request, res: Response) {
  const user = req.user as AuthPayload;

  const abillity = await buildUserAbillity(user.id);

  if (!abillity.can('read', 'Agents')) {
    return res.status(HttpStatus.FORBIDDEN).json({ message: 'Você não tem permissão.' });
  }

  const { id } = idSchema.parse(req.params);
  const response = await getAgent(id);
  return res.status(200).json(response);
}
