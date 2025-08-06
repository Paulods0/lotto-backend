import type { Request, Response } from 'express';
import { idSchema } from '../../validations/common/id.schema';
import { getLicence } from '../../services/licence/get.service';

export async function handle(req: Request, res: Response) {
  const { id } = idSchema.parse(req.params);
  const response = await getLicence(id);

  return res.status(200).json(response);
}
