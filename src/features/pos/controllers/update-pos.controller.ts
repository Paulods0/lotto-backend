import type { Request, Response } from 'express';
import { AuthPayload } from '../../../@types/auth-payload';
import { HttpStatus } from '../../../constants/http';
import { buildUserAbillity } from '../../../permissions/build-abillity';
import { idSchema } from '../../../schemas/common/id.schema';
import { updatePosSchema } from '../schemas/update.schema';
import { updatePos } from '../services/update-pos.service';

export async function updatePosController(req: Request, res: Response) {
  const user = req.user as AuthPayload;

  const ability = await buildUserAbillity(user.id);

  if (!ability.can('update', 'Pos')) {
    return res.status(HttpStatus.FORBIDDEN).json({ message: 'Você não tem permissão' });
  }

  const { id } = idSchema.parse(req.params);
  const body = updatePosSchema.parse({ ...req.body, id, user });

  const response = await updatePos(body);

  return res.status(200).json({
    message: 'Os dados do pos foram atualizados com sucesso.',
    data: response,
  });
}
