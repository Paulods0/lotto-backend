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
simCardRouter.delete('/delele-many', catchErrors(deleteManySimCardsController));
simCardRouter.get('/', catchErrors(fetchManySimCardsController));
simCardRouter.get('/:id', catchErrors(getSimCardController));

export default simCardRouter;
