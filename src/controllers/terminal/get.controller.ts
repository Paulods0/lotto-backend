import type { Request, Response } from 'express';
import { idSchema } from '../../validations/common/id.schema';
import { getTerminal } from '../../services/terminal/get.service';
import { AuthPayload } from '../../@types/auth-payload';
import { HttpStatus } from '../../constants/http';
import { buildUserAbillity } from '../../permissions/build-abillity';

export async function handle(req: Request, res: Response) {
  const user = req.user as AuthPayload;

  const ability = await buildUserAbillity(user.id);

  if (!ability.can('read', 'Terminals')) {
    return res.status(HttpStatus.FORBIDDEN).json({ message: 'Você não tem permissão' });
  }

  const { id } = idSchema.parse(req.params);

  const response = await getTerminal(id);

  return res.status(200).json(response);
}
