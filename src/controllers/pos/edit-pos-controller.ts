import type { Request, Response } from 'express';
import { idSchema } from '../../validations/@common/id.schema';
import { editPosService } from '../../services/pos/edit-pos.service';
import { editPosSchema } from '../../validations/pos-schemas/edit-pos-schema';

export async function editPosController(req: Request, res: Response) {
  const { id } = idSchema.parse(req.params);
  const user = req.user;
  const body = editPosSchema.parse({ ...req.body, id, user });

  const response = await editPosService(body);

  return res.status(200).json({
    message: 'Os dados do pos foram atualizados com sucesso.',
    data: response,
  });
}
