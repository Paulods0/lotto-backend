import { Router } from 'express';

import catchErrors from '../utils/catch-errors';
import { handle as fetchManyAuditLogsController } from '../controllers/audit-log/fetch-many.controller';

const auditLogRouter = Router();

auditLogRouter.get('/', catchErrors(fetchManyAuditLogsController));

export default auditLogRouter;
