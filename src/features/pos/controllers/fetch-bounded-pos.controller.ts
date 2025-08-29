import type { Request, Response } from 'express';
import { AuthPayload } from '../../../@types/auth-payload';
import { HttpStatus } from '../../../constants/http';
import { buildUserAbillity } from '../../../permissions/build-abillity';
import { boundedBoxSchema } from '../schemas/bounds';
import { fecthBoundedPosService } from '../services/fetch-bounded-pos-service';

export async function fetchBoundedPosController(req: Request, res: Response) {
  const user = req.user as AuthPayload;

  const ability = await buildUserAbillity(user.id);

  if (!ability.can('read', 'Pos')) {
    return res.status(HttpStatus.FORBIDDEN).json({ message: 'Você não tem permissão' });
  }

  const bounds = boundedBoxSchema.parse(req.query);
  const response = await fecthBoundedPosService(bounds);
  return res.status(200).json(response);
}
