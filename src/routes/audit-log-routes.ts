import { Router } from 'express';

import catchErrors from '../utils/catch-errors';
import { fetchManyAuditLogsController } from '../controllers/audit-log/fetch-many-audit-logs-controller';

const auditLogRouter = Router();

auditLogRouter.get('/', catchErrors(fetchManyAuditLogsController));

export default auditLogRouter;
