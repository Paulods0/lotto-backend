import { Router } from 'express';

import catchErrors from '../utils/catch-errors';
import { getPosController } from '../controllers/pos/get-pos-controller';
import { editPosController } from '../controllers/pos/update-pos-controller';
import { deletePosController } from '../controllers/pos/delete-pos-controller';
import { createPosController } from '../controllers/pos/create-pos-controller';
import { fetchManyPosController } from '../controllers/pos/fetch-many-pos-controller';
import { fetchBoundedPosController } from '../controllers/pos/fetch-bounded-pos-controller';

const posRouter = Router();

posRouter.post('/', catchErrors(createPosController));
posRouter.put('/:id', catchErrors(editPosController));
posRouter.delete('/:id', catchErrors(deletePosController));

posRouter.get('/bounds', catchErrors(fetchBoundedPosController));
posRouter.get('/', catchErrors(fetchManyPosController));
posRouter.get('/:id', catchErrors(getPosController));

export default posRouter;
