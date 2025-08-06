import { Router } from 'express';

import catchErrors from '../utils/catch-errors';
import { handle as getAgentController } from '../controllers/agent/get.controller';
import { handle as updateAgentController } from '../controllers/agent/update.controller';
import { handle as createAgentController } from '../controllers/agent/create.controller';
import { handle as fetchManyAgentsController } from '../controllers/agent/fetch.controller';

const agentRouter = Router();

agentRouter.post('/', catchErrors(createAgentController));
agentRouter.put('/:id', catchErrors(updateAgentController));
agentRouter.get('/', catchErrors(fetchManyAgentsController));
agentRouter.get('/:id', catchErrors(getAgentController));

export default agentRouter;
