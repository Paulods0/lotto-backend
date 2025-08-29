import {
  createUserController,
  deleteUserController,
  fetchManyUsersController,
  getUserController,
  updateUserController,
} from './controllers';
import { Router } from 'express';
import catchErrors from '../../utils/catch-errors';

const userRouter = Router();

userRouter.post('/', catchErrors(createUserController));
userRouter.put('/:id', catchErrors(updateUserController));
userRouter.delete('/:id', catchErrors(deleteUserController));
userRouter.get('/:id', catchErrors(getUserController));
userRouter.get('/', catchErrors(fetchManyUsersController));

export default userRouter;
