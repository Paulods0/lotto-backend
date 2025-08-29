import type { Request, Response } from 'express';
import { AuthPayload } from '../../../@types/auth-payload';
import { HttpStatus } from '../../../constants/http';
import { buildUserAbillity } from '../../../permissions/build-abillity';
import { createTerminalSchema } from '../schemas/create-terminal.schema';
import { createTerminalService } from '../services';

export async function createTerminalController(req: Request, res: Response) {
  const user = req.user as AuthPayload;

  const ability = await buildUserAbillity(user.id);

  if (!ability.can('write', 'Terminals')) {
    return res.status(HttpStatus.FORBIDDEN).json({ message: 'Você não tem permissão' });
  }

  const body = createTerminalSchema.parse({ ...req.body, user });
  const response = await createTerminalService(body);

  return res.status(201).json({
    message: 'Terminal criado com sucesso',
    data: response,
  });
}
