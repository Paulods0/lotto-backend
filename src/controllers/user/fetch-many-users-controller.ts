import type { Request, Response } from 'express';
import { paramsSchema } from '../../validations/@common/query.schema';
import { fetchManyUsersService } from '../../services/user/fetch-many-users-service';

export async function fetchManyUsersController(req: Request, res: Response) {
  const { limit, page, query } = paramsSchema.parse(req.query);
  const response = await fetchManyUsersService({ limit, page, query });
  return res.status(200).json(response);
}
