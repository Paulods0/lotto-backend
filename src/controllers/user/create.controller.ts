import type { Request, Response } from 'express';
import { AuthPayload } from '../../@types/auth-payload';
import { createUser } from '../../services/user/create.service';
import { createUserSchema } from '../../validations/user/create.schema';

export async function handle(req: Request, res: Response) {
  const user = req.user as AuthPayload;

  const body = createUserSchema.parse({ ...req.body, user });
  const response = await createUser(body);

  return res.status(201).json({
    message: 'Usuário criado com sucesso.',
    data: response,
  });
}
