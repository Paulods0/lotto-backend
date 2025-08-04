import type { Request, Response } from 'express';
import { createPosService } from '../../services/pos/create-pos.service';
import { createPosSchema } from '../../validations/pos-schemas/create-pos-schema';
import { AuthPayload } from '../../@types/auth-payload';

export async function createPosController(req: Request, res: Response) {
  const user = req.user as AuthPayload;
  const body = createPosSchema.parse({ ...req.body, user });
  const response = await createPosService(body);

  return res.status(201).json({
    message: 'Pos criado com sucesso',
    data: response,
  });
}
