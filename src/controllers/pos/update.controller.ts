import type { Request, Response } from 'express';
import { idSchema } from '../../validations/common/id.schema';
import { updatePos } from '../../services/pos/update-pos.service';
import { updatePosSchema } from '../../validations/pos/update.schema';
import { AuthPayload } from '../../@types/auth-payload';

export async function handle(req: Request, res: Response) {
  const user = req.user as AuthPayload;

  const { id } = idSchema.parse(req.params);
  const body = updatePosSchema.parse({ ...req.body, id, user });

  const response = await updatePos(body);

  return res.status(200).json({
    message: 'Os dados do pos foram atualizados com sucesso.',
    data: response,
  });
}
