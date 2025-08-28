import { Request, Response } from 'express';
import { idSchema } from '../../validations/common/id.schema';
import { updateGroup } from '../../services/group/update-group.service';
import { updateGroupSchema } from '../../validations/group/update.schema';

export async function handle(req: Request, res: Response) {
  const id = req.params.id;
  const body = updateGroupSchema.parse({ ...req.body, id });

  await updateGroup(body);

  return res.status(200).json({ message: 'Grupo atualizado com sucesso' });
}
