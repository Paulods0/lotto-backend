import {
  createPosController,
  updatePosController,
  deletePosController,
  fetchManyPosController,
  getPosController,
  fetchBoundedPosController,
} from './controllers';
import { Router } from 'express';
import catchErrors from '../../utils/catch-errors';

const posRouter = Router();

posRouter.post('/', catchErrors(createPosController));
posRouter.put('/:id', catchErrors(updatePosController));
posRouter.delete('/:id', catchErrors(deletePosController));

posRouter.get('/:id', catchErrors(getPosController));
posRouter.get('/', catchErrors(fetchManyPosController));

posRouter.get('/bounds', catchErrors(fetchBoundedPosController));

export default posRouter;
