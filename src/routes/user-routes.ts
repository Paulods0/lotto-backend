import { Router } from 'express';

import { getUserController } from '../controllers/user/get-user-controller';
import { updateUserController } from '../controllers/user/update-user-controller';
import { createUserController } from '../controllers/user/create-user-controller';
import { deleteUserController } from '../controllers/user/delete-user-controller';
import { fetchManyUsersController } from '../controllers/user/fetch-many-users-controller';
import catchErrors from '../utils/catch-errors';

const userRouter = Router();

userRouter.post('/', catchErrors(createUserController));
userRouter.put('/:id', catchErrors(updateUserController));
userRouter.delete('/:id', catchErrors(deleteUserController));
userRouter.get('/:id', catchErrors(getUserController));
userRouter.get('/', catchErrors(fetchManyUsersController));

export default userRouter;
