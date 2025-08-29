import { Request, Response } from 'express';
import { updateGroupSchema } from '../schemas/update.schema';

export async function updateGroupController(req: Request, res: Response) {
  const id = req.params.id;
  const body = updateGroupSchema.parse({ ...req.body, id });

  return res.status(200).json({ message: 'Grupo atualizado com sucesso' });
}
