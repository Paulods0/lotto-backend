import type { Request, Response } from 'express';
import { paramsSchema } from '../../validations/common/query.schema';
import { fetchManyTerminals } from '../../services/terminal/fetch-many.service';

export async function handle(req: Request, res: Response) {
  const query = paramsSchema.parse(req.query);
  const response = await fetchManyTerminals(query);

  return res.status(200).json(response);
}
