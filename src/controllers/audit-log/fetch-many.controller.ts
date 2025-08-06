import type { Response, Request } from 'express';
import { fetchManyAuditLogs } from '../../services/audit-log/fetch-many.service';

export async function handle(_req: Request, res: Response) {
  const response = await fetchManyAuditLogs();
  return res.status(200).json(response);
}
