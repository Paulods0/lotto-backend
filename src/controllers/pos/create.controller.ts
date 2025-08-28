import type { Request, Response } from 'express';
import { AuthPayload } from '../../@types/auth-payload';
import { createPos } from '../../services/pos/create-pos.service';
import { createPosSchema } from '../../validations/pos/create.schema';
import { HttpStatus } from '../../constants/http';
import { buildUserAbillity } from '../../permissions/build-abillity';

export async function handle(req: Request, res: Response) {
  const user = req.user as AuthPayload;

  const ability = await buildUserAbillity(user.id);

  if (!ability.can('write', 'Pos')) {
    return res.status(HttpStatus.FORBIDDEN).json({ message: 'Você não tem permissão' });
  }

  const body = createPosSchema.parse({ ...req.body, user });
  const response = await createPos(body);

  return res.status(201).json({
    message: 'Pos criado com sucesso',
    data: response,
  });
}
