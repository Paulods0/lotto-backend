import { Router } from 'express';

import catchErrors from '../utils/catch-errors';
import { handle as getPosController } from '../controllers/pos/get.controller';
import { handle as editPosController } from '../controllers/pos/update.controller';
import { handle as deletePosController } from '../controllers/pos/delete.controller';
import { handle as createPosController } from '../controllers/pos/create.controller';
import { handle as fetchManyPosController } from '../controllers/pos/fetch-many.controller';
import { handle as fetchBoundedPosController } from '../controllers/pos/fetch-bounded.controller';

const posRouter = Router();

posRouter.post('/', catchErrors(createPosController));
posRouter.put('/:id', catchErrors(editPosController));
posRouter.delete('/:id', catchErrors(deletePosController));

posRouter.get('/bounds', catchErrors(fetchBoundedPosController));
posRouter.get('/', catchErrors(fetchManyPosController));
posRouter.get('/:id', catchErrors(getPosController));

export default posRouter;
