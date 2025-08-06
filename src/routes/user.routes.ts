import { Router } from 'express';

import catchErrors from '../utils/catch-errors';
import { handle as getUserController } from '../controllers/user/get.controller';
import { handle as updateUserController } from '../controllers/user/update.controller';
import { handle as createUserController } from '../controllers/user/create.controller';
import { handle as deleteUserController } from '../controllers/user/delete.controller';
import { handle as fetchManyUsersController } from '../controllers/user/fetch-many.controller';

const userRouter = Router();

userRouter.post('/', catchErrors(createUserController));
userRouter.put('/:id', catchErrors(updateUserController));
userRouter.delete('/:id', catchErrors(deleteUserController));
userRouter.get('/:id', catchErrors(getUserController));
userRouter.get('/', catchErrors(fetchManyUsersController));

export default userRouter;
