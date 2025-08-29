import type { Request, Response } from 'express';
import { HttpStatus } from '../../constants/http';
import { AuthPayload } from '../../@types/auth-payload';
import { boundedBoxSchema } from '../../validations/pos/bounds';
import { buildUserAbillity } from '../../permissions/build-abillity';
import { fecthBoundedPos } from '../../services/pos/fetch-bounded-pos-service';

export async function handle(req: Request, res: Response) {
  const user = req.user as AuthPayload;

  const ability = await buildUserAbillity(user.id);

  if (!ability.can('read', 'Pos')) {
    return res.status(HttpStatus.FORBIDDEN).json({ message: 'Você não tem permissão' });
  }

  const bounds = boundedBoxSchema.parse(req.query);
  const response = await fecthBoundedPos(bounds);
  return res.status(200).json(response);
}
