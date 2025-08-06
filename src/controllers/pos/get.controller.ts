import type { Request, Response } from 'express';
import { idSchema } from '../../validations/common/id.schema';
import { getPos } from '../../services/pos/get-pos.service';

export async function handle(req: Request, res: Response) {
  const { id } = idSchema.parse(req.params);
  const response = await getPos(id);

  return res.status(200).json(response);
}
