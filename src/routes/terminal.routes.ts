import { Router } from 'express';

import catchErrors from '../utils/catch-errors';
import { handle as getTerminalController } from '../controllers/terminal/get.controller';
import { handle as updateTerminalController } from '../controllers/terminal/update.controller';
import { handle as createTerminalController } from '../controllers/terminal/create.controller';
import { handle as deleteTerminalController } from '../controllers/terminal/delete.controller';
import { handle as fetchManyTerminalsController } from '../controllers/terminal/fetch-many.controller';

const terminalRouter = Router();

terminalRouter.post('/', catchErrors(createTerminalController));
terminalRouter.put('/:id', catchErrors(updateTerminalController));

terminalRouter.delete('/:id', catchErrors(deleteTerminalController));

terminalRouter.get('/', catchErrors(fetchManyTerminalsController));
terminalRouter.get('/:id', catchErrors(getTerminalController));

export default terminalRouter;
