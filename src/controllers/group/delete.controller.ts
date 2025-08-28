import { Request, Response } from 'express';
import { deleteGroupService } from '../../services/group/delete-group.service';

export async function handle(req: Request, res: Response) {
  const id = req.params.id;

  await deleteGroupService(id);

  return res.status(200).json({ message: 'Grupo removido com sucesso' });
}
