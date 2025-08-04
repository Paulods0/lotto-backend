import type { Request, Response } from 'express';
import { idSchema } from '../../validations/@common/id.schema';
import { updatePosService } from '../../services/pos/update-pos.service';
import { updatePosSchema } from '../../validations/pos-schemas/update-pos-schema';
import { AuthPayload } from '../../@types/auth-payload';

export async function editPosController(req: Request, res: Response) {
  const user = req.user as AuthPayload;

  const { id } = idSchema.parse(req.params);
  const body = updatePosSchema.parse({ ...req.body, id, user });

  const response = await updatePosService(body);

  return res.status(200).json({
    message: 'Os dados do pos foram atualizados com sucesso.',
    data: response,
  });
}
