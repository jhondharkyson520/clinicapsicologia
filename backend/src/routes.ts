import { Router } from 'express';

import { CreateUserController } from './controllers/user/CreateUserController';
import { AuthUserController } from './controllers/user/AuthUserController';
import { DetailUserController } from './controllers/user/DetailUserController';

import { isAuthenticated } from './middlewares/isAuthenticated';
import { CreateClientController } from './controllers/client/CreateClientController';
import { ListClientController } from './controllers/client/ListClientController';

const router = Router();

router.post('/users', new CreateUserController().handle);
router.post('/session', new AuthUserController().handle);
router.get('/me', isAuthenticated, new DetailUserController().handle);
router.post('/client', isAuthenticated, new CreateClientController().handle);
router.get('/clientlist', isAuthenticated, new ListClientController().handle);

export {router};