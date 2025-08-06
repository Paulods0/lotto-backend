import type { Request, Response } from 'express';

import { AuthPayload } from '../../@types/auth-payload';
import { createPos } from '../../services/pos/create-pos.service';
import { createPosSchema } from '../../validations/pos/create.schema';

export async function handle(req: Request, res: Response) {
  const user = req.user as AuthPayload;
  const body = createPosSchema.parse({ ...req.body, user });
  const response = await createPos(body);

  return res.status(201).json({
    message: 'Pos criado com sucesso',
    data: response,
  });
}
