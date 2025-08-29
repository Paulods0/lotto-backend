import type { Request, Response } from 'express';
import { AuthPayload } from '../../../@types/auth-payload';
import { buildUserAbillity } from '../../../permissions/build-abillity';
import { HttpStatus } from '../../../constants/http';
import { createPosSchema } from '../schemas/create-pos.schema';
import { createPosService } from '../services';

export async function createPosController(req: Request, res: Response) {
  const user = req.user as AuthPayload;

  const ability = await buildUserAbillity(user.id);

  if (!ability.can('write', 'Pos')) {
    return res.status(HttpStatus.FORBIDDEN).json({ message: 'Você não tem permissão' });
  }

  const body = createPosSchema.parse({ ...req.body, user });
  const response = await createPosService(body);

  return res.status(201).json({
    message: 'Pos criado com sucesso',
    data: response,
  });
}
