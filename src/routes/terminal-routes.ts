import { Router } from 'express';

import { getTerminalController } from '../controllers/terminal/get-terminal-controller';
import { editTerminalController } from '../controllers/terminal/edit-terminal-controller';
import { createTerminalController } from '../controllers/terminal/create-terminal-controller';
import { deleteTerminalController } from '../controllers/terminal/delete-terminal-controller';
import { fetchManyTerminalsController } from '../controllers/terminal/fetch-many-terminals-controller';
import { deleteManyTerminalsController } from '../controllers/terminal/delete-many-terminals-controller';
import catchErrors from '../utils/catch-errors';

const terminalRouter = Router();

terminalRouter.post('/', catchErrors(createTerminalController));
terminalRouter.put('/:id', catchErrors(editTerminalController));

terminalRouter.delete('/bulk', catchErrors(deleteManyTerminalsController));
terminalRouter.delete('/:id', catchErrors(deleteTerminalController));

terminalRouter.get('/', catchErrors(fetchManyTerminalsController));
terminalRouter.get('/:id', catchErrors(getTerminalController));

export default terminalRouter;
