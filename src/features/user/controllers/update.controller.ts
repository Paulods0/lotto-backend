import type { Request, Response } from 'express';
import { AuthPayload } from '../../@types/auth-payload';
import { idSchema } from '../../validations/common/id.schema';
import { updateUserSchema } from '../../validations/user/update.schema';
import { updateUser } from '../../services/user/update.service';

export async function handle(req: Request, res: Response) {
  const user = req.user as AuthPayload;
  const { id } = idSchema.parse(req.params);

  const body = updateUserSchema.parse({ ...req.body, id, user });

  const response = await updateUser(body);

  return res.status(200).json({
    message: 'Os dados do usuário foram atualizados com sucesso.',
    data: response,
  });
}
