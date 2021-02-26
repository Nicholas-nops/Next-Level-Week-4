import {Router} from 'express';
import { UserController } from  './controllers/UserController'
import {SurveysController} from  './controllers/SurveyController'
import { SendMailController } from './controllers/SendMailController';

//delegação das rotas para seus respectivos(post,get)
const userController = new UserController();
const surveyController = new SurveysController();

const sendMailController = new SendMailController()


const router = Router();

router.post('/users', userController.create);
router.post('/surveys', surveyController.create); 
router.get('/surveys', surveyController.show);


router.post('/sendMail', sendMailController.execute)

export {router};