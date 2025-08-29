import { Router } from 'express';
import catchErrors from '../../utils/catch-errors';
import { createGroupController } from './controllers/create-group.controller';
import { deleteGroupController } from './controllers/delete-group.controller';
import { fetchManyGroupsController } from './controllers/fetch-many-groups.controller';
import { getFeaturesController } from './controllers/get-features.controller';
import { updateGroupController } from './controllers/update-group.controller';

const groupRouter = Router();

groupRouter.post('/', catchErrors(createGroupController));
groupRouter.get('/', catchErrors(fetchManyGroupsController));
groupRouter.get('/features', catchErrors(getFeaturesController));
groupRouter.patch('/:id', catchErrors(updateGroupController));
groupRouter.delete('/:id', catchErrors(deleteGroupController));

export default groupRouter;
