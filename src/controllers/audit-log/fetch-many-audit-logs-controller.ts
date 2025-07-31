import type { Request, Response } from 'express';
import { fetchManyAuditLogsServices } from '../../services/audit-log/fetch-many-audit-logs-services';

export async function fetchManyAuditLogsController(req: Request, res: Response) {
  const response = await fetchManyAuditLogsServices();
  return res.status(200).json(response);
}
