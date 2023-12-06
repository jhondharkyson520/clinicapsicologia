import { Router } from 'express';

import { CreateUserController } from './controllers/user/CreateUserController';
import { AuthUserController } from './controllers/user/AuthUserController';
import { DetailUserController } from './controllers/user/DetailUserController';

import { isAuthenticated } from './middlewares/isAuthenticated';
import { CreateClientController } from './controllers/client/CreateClientController';
import { ListClientController } from './controllers/client/ListClientController';
import { CreateAgendaController } from './controllers/agenda/CreateAgendaController';
import { ListAgendaController } from './controllers/agenda/ListAgendaController';
import { CreateCaixaController } from './controllers/caixa/CreateCaixaController';
import { ListCaixaController } from './controllers/caixa/ListCaixaController';


const router = Router();

router.post('/users', new CreateUserController().handle);
router.post('/session', new AuthUserController().handle);
router.get('/me', isAuthenticated, new DetailUserController().handle);
router.post('/client', isAuthenticated, new CreateClientController().handle);
router.get('/clientlist', isAuthenticated, new ListClientController().handle);
router.post('/agenda', isAuthenticated, new CreateAgendaController().handle);
router.get('/agendalist', isAuthenticated, new ListAgendaController().handle);
router.post('/lancamento', isAuthenticated, new CreateCaixaController().handle);
router.get('/caixalist', isAuthenticated, new ListCaixaController().handle);


export {router};