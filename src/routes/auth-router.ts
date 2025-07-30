import { Router } from 'express';
import { loginController } from '../controllers/auth/login-controller';
import { logoutController } from '../controllers/auth/logout-controller';
import catchErrors from '../utils/catch-errors';

const loginRouter = Router();

loginRouter.post('/login', catchErrors(loginController));
loginRouter.get('/logout', catchErrors(logoutController));

export default loginRouter;
