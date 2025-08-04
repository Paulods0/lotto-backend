import type { Request, Response } from 'express';
import { idSchema } from '../../validations/@common/id.schema';
import { deletePosService } from '../../services/pos/delete-pos.service';
import { AuthPayload } from '../../@types/auth-payload';

export async function deletePosController(req: Request, res: Response) {
  const { id } = idSchema.parse(req.params);
  const user = req.user as AuthPayload;

  await deletePosService(id, user);

  return res.status(200).json({
    message: 'Pos removido com sucesso',
  });
}
