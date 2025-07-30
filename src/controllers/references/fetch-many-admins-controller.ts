import type { Request, Response } from 'express';
import { fetchManyAdminsService } from '../../services/references/fetch-many-admins-service';

export async function fetchManyAdminsController(_req: Request, res: Response) {
  const response = await fetchManyAdminsService();
  return res.status(200).json(response);
}
