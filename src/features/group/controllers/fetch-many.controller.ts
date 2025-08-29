import type { Response, Request } from 'express';
import { fetchManyGroupsService } from '../../features/group/services/fetch-many-groups.service';

export async function handle(req: Request, res: Response) {
  const response = await fetchManyGroupsService();

  return res.status(200).json(response);
}
