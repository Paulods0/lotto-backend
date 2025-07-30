import { Router } from 'express';

import catchErrors from '../utils/catch-errors';
import { getAgentController } from '../controllers/agent/get-agent-controller';
import { editAgentController } from '../controllers/agent/edit-agent-controller';
import { createAgentController } from '../controllers/agent/create-agent-controller';
import { fetchManyAgentsController } from '../controllers/agent/fetch-many-agents-controller';

const agentRouter = Router();

agentRouter.post('/', catchErrors(createAgentController));
agentRouter.put('/:id', catchErrors(editAgentController));
agentRouter.get('/:id', catchErrors(getAgentController));
agentRouter.get('/', catchErrors(fetchManyAgentsController));

export default agentRouter;
