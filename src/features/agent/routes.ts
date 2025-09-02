import {
  getAgentController,
  deleteAgentController,
  createAgentController,
  updateAgentController,
  fetchManyAgentsController,
} from './controllers';
import { Router } from 'express';
import catchErrors from '../../utils/catch-errors';

const agentRouter = Router();

agentRouter.post('/', catchErrors(createAgentController));
agentRouter.put('/:id', catchErrors(updateAgentController));
agentRouter.delete('/:id', catchErrors(deleteAgentController));
agentRouter.get('/:id', catchErrors(getAgentController));
agentRouter.get('/', catchErrors(fetchManyAgentsController));

export default agentRouter;
