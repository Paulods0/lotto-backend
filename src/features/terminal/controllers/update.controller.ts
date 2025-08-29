import type { Request, Response } from 'express';
import { HttpStatus } from '../../constants/http';
import { AuthPayload } from '../../@types/auth-payload';
import { idSchema } from '../../validations/common/id.schema';
import { buildUserAbillity } from '../../permissions/build-abillity';
import { updateTerminal } from '../../services/terminal/update.service';
import { updateTerminalSchema } from '../../validations/terminal/update.schema';

export async function handle(req: Request, res: Response) {
  const user = req.user as AuthPayload;

  const ability = await buildUserAbillity(user.id);

  if (!ability.can('update', 'Terminals')) {
    return res.status(HttpStatus.FORBIDDEN).json({ message: 'Você não tem permissão' });
  }

  const { id } = idSchema.parse(req.params);
  const body = updateTerminalSchema.parse({ ...req.body, id, user });

  const response = await updateTerminal(body);

  return res.status(200).json({
    message: 'Os dados do terminal foram atualizados com sucesso.',
    data: response,
  });
}
