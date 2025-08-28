import { Router } from 'express';

import catchErrors from '../utils/catch-errors';
import { createSimCardController } from '../controllers/sim-card/create-sim-card.controller';

const simCardRouter = Router();

simCardRouter.post('/', catchErrors(createSimCardController));

export default simCardRouter;
