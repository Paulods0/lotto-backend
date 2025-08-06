import type { Request, Response } from 'express';
import { fetchManyAdmins } from '../../services/references/fetch-admins-service';

export async function handle(_req: Request, res: Response) {
  const response = await fetchManyAdmins();
  return res.status(200).json(response);
}
