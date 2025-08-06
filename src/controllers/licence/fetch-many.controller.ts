import type { Request, Response } from 'express';
import { paramsSchema } from '../../validations/common/query.schema';
import { fetchManyLicences } from '../../services/licence/fetch-many.service';

export async function handle(req: Request, res: Response) {
  const query = paramsSchema.parse(req.query);
  const response = await fetchManyLicences(query);

  return res.status(200).json(response);
}
