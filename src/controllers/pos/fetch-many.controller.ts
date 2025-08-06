import type { Request, Response } from 'express';
import { paramsSchema } from '../../validations/common/query.schema';
import { fetchManyPos } from '../../services/pos/fetch-many-pos.service';

export async function handle(req: Request, res: Response) {
  const query = paramsSchema.parse(req.query);

  const result = await fetchManyPos(query);

  return res.status(200).json(result);
}
