import { Router } from 'express';
import catchErrors from '../utils/catch-errors';
import { loginController } from '../controllers/auth/login-controller';
import { logoutController } from '../controllers/auth/logout-controller';
import { getUserProfileController } from '../controllers/auth/get-user-profile';

const loginRouter = Router();

loginRouter.post('/login', catchErrors(loginController));
loginRouter.get('/logout', catchErrors(logoutController));
loginRouter.get('/me', catchErrors(getUserProfileController));

export default loginRouter;
