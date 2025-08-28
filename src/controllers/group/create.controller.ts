import type { Response, Request } from 'express';
import { createGroupService } from '../../services/group/create-group.service';
import { createGroupSchema } from '../../validations/group/create.schema';

export async function handle(req: Request, res: Response) {
  const body = createGroupSchema.parse(req.body);

  await createGroupService(body);

  return res.status(201).json({
    message: 'Grupo criado com sucesso',
  });
}
