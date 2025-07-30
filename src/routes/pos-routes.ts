import { Router } from 'express';

import catchErrors from '../utils/catch-errors';
import { getPosController } from '../controllers/pos/get-pos-controller';
import { editPosController } from '../controllers/pos/edit-pos-controller';
import { deletePosController } from '../controllers/pos/delete-pos-controller';
import { createPosController } from '../controllers/pos/create-pos-controller';
import { fetchManyPosController } from '../controllers/pos/fetch-many-pos-controller';
import { fetchManyPosWithCoordinatesController } from '../controllers/pos/fetch-many-pos-with-coordinates-controller';

const posRouter = Router();

posRouter.post('/', catchErrors(createPosController));
posRouter.put('/:id', catchErrors(editPosController));
posRouter.delete('/:id', catchErrors(deletePosController));

posRouter.get('/coordinates', catchErrors(fetchManyPosWithCoordinatesController));
posRouter.get('/', catchErrors(fetchManyPosController));
posRouter.get('/:id', catchErrors(getPosController));

export default posRouter;
