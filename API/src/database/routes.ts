import {Router} from 'express';
import { UserController } from  '../controllers/UserController'

//delegação das rotas para seus respectivos(post,get)
const userController = new UserController();


const router = Router();

router.post('/users', userController.create);

export {router};