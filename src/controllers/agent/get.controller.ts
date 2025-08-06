import type { Request, Response } from 'express';
import { idSchema } from '../../validations/common/id.schema';
import { getAgent } from '../../services/agent/get.service';

export async function handle(req: Request, res: Response) {
  const { id } = idSchema.parse(req.params);
  const response = await getAgent(id);
  return res.status(200).json(response);
}
