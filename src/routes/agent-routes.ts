import { Router } from 'express';

import catchErrors from '../utils/catch-errors';
import { getAgentController } from '../controllers/agent/get-agent-controller';
import { updateAgentController } from '../controllers/agent/update-agent-controller';
import { createAgentController } from '../controllers/agent/create-agent-controller';
import { fetchManyAgentsController } from '../controllers/agent/fetch-many-agents-controller';

const agentRouter = Router();

agentRouter.post('/', catchErrors(createAgentController));
agentRouter.put('/:id', catchErrors(updateAgentController));

agentRouter.get('/', catchErrors(fetchManyAgentsController));
agentRouter.get('/:id', catchErrors(getAgentController));

export default agentRouter;
