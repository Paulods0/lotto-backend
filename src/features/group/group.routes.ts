import { Router } from 'express';
import catchErrors from '../utils/catch-errors';
import { getFeaturesController } from '../controllers/group/get-features.controller';
import { handle as deleteGroupController } from '../controllers/group/delete.controller';
import { handle as createGroupController } from '../controllers/group/create.controller';
import { handle as updateGroupController } from '../controllers/group/update.controller';
import { handle as fetchManyGroupsController } from '../controllers/group/fetch-many.controller';

const groupRouter = Router();

groupRouter.post('/', catchErrors(createGroupController));
groupRouter.get('/', catchErrors(fetchManyGroupsController));
groupRouter.get('/features', catchErrors(getFeaturesController));
groupRouter.patch('/:id', catchErrors(updateGroupController));
groupRouter.delete('/:id', catchErrors(deleteGroupController));

export default groupRouter;
