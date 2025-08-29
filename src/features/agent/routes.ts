import { Router } from 'express';
import catchErrors from '../../utils/catch-errors';
import { fetchManyAgentsController } from './controllers/fetch-many-agents.controller';
import { getAgentController } from './controllers/get-agent.controller';
import { updateAgentController } from './controllers/update-agent.controller';
import { createAgentController } from './controllers/create-agent.controller';

const agentRouter = Router();

agentRouter.post('/', catchErrors(createAgentController));
agentRouter.put('/:id', catchErrors(updateAgentController));
agentRouter.get('/', catchErrors(fetchManyAgentsController));
agentRouter.get('/:id', catchErrors(getAgentController));

export default agentRouter;
