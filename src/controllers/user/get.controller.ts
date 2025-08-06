import type { Request, Response } from 'express';
import { getUser } from '../../services/user/get.service';
import { idSchema } from '../../validations/common/id.schema';

export async function handle(req: Request, res: Response) {
  const { id } = idSchema.parse(req.params);

  const response = await getUser(id);

  return res.status(200).json(response);
}
