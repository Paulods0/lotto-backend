import {
  createGroupController,
  deleteGroupController,
  fetchManyGroupsController,
  getGroupsController,
  updateGroupController,
} from './controllers';
import { Router } from 'express';
import catchErrors from '../../utils/catch-errors';

const groupRouter = Router();

groupRouter.post('/', catchErrors(createGroupController));
groupRouter.put('/:id', catchErrors(updateGroupController));
groupRouter.delete('/:id', catchErrors(deleteGroupController));
groupRouter.get('/:id', catchErrors(getGroupsController));
groupRouter.get('/', catchErrors(fetchManyGroupsController));

export default groupRouter;
