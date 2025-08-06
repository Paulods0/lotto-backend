import type { Request, Response } from 'express';
import { paramsSchema } from '../../validations/common/query.schema';
import { fetchManyUsers } from '../../services/user/fetch-many.service';

export async function handle(req: Request, res: Response) {
  const { limit, page, query } = paramsSchema.parse(req.query);

  const response = await fetchManyUsers({ limit, page, query });

  return res.status(200).json(response);
}
