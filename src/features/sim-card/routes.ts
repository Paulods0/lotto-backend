import {
  createSimCardController,
  deleteManySimCardsController,
  deleteSimCardController,
  fetchManySimCardsController,
  getSimCardController,
  updateSimCardController,
} from './controllers';
import { Router } from 'express';
import catchErrors from '../../utils/catch-errors';

const simCardRouter = Router();

simCardRouter.post('/', catchErrors(createSimCardController));
simCardRouter.put('/:id', catchErrors(updateSimCardController));
simCardRouter.delete('/:id', catchErrors(deleteSimCardController));
simCardRouter.delete('/bulk', catchErrors(deleteManySimCardsController));
simCardRouter.get('/:id', catchErrors(getSimCardController));
simCardRouter.get('/', catchErrors(fetchManySimCardsController));

export default simCardRouter;
