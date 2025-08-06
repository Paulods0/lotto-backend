import { Router } from 'express';
import catchErrors from '../utils/catch-errors';
import { authenticate } from '../middleware/auth/authenticate';
import { handle as loginController } from '../controllers/auth/login.controller';
import { handle as logoutController } from '../controllers/auth/logout.controller';
import { handle as getUserProfileController } from '../controllers/auth/get-profile.controller';

const authRouter = Router();

authRouter.post('/login', catchErrors(loginController));
authRouter.get('/logout', catchErrors(logoutController));
authRouter.get('/me', authenticate, catchErrors(getUserProfileController));

export default authRouter;
