import { Router } from 'express';
import catchErrors from '../utils/catch-errors';
import { loginController } from '../controllers/auth/login-controller';
import { logoutController } from '../controllers/auth/logout-controller';
import { getUserProfileController } from '../controllers/auth/get-user-profile';
import { authenticate } from '../middleware/auth/authenticate';

const authRouter = Router();

authRouter.post('/login', catchErrors(loginController));
authRouter.get('/logout', catchErrors(logoutController));
authRouter.get('/me', authenticate, catchErrors(getUserProfileController));

export default authRouter;
