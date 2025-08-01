import type { Request, Response } from 'express';
import { idSchema } from '../../validations/@common/id.schema';
import { editUserSchema } from '../../validations/user/edit-user-schema';
import { editUserService } from '../../services/user/edit-user-service';

export async function editUserController(req: Request, res: Response) {
  const user = req.user

  const { id } = idSchema.parse(req.params);
  const body = editUserSchema.parse({ ...req.body, id,user });

  const response = await editUserService(body);

  return res.status(200).json({
    message: 'Os dados do usuário foram atualizados com sucesso.',
    data: response,
  });
}
