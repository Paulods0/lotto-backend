import type { Request, Response } from 'express';
import { AuthPayload } from '../../../@types/auth-payload';
import { buildUserAbillity } from '../../../permissions/build-abillity';
import { HttpStatus } from '../../../constants/http';
import { idSchema } from '../../../schemas/common/id.schema';
import { updateTerminalSchema } from '../schemas/update-terminal.schema';
import { updateTerminalService } from '../services';

export async function updateTerminalController(req: Request, res: Response) {
  const user = req.user as AuthPayload;

  const ability = await buildUserAbillity(user.id);

  if (!ability.can('update', 'Terminals')) {
    return res.status(HttpStatus.FORBIDDEN).json({ message: 'Você não tem permissão' });
  }

  const { id } = idSchema.parse(req.params);
  const body = updateTerminalSchema.parse({ ...req.body, id, user });

  const response = await updateTerminalService(body);

  return res.status(200).json({
    message: 'Os dados do terminal foram atualizados com sucesso.',
    data: response,
  });
}
