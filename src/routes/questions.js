// question routes
import { Router } from 'express';
import { createQuestion, getQuestions, getQuestionById, countQuestions } from '../controllers/questionsController.js';
import { authentification } from '../controllers/authController.js';

const router = Router();


router.get('/', getQuestions);

// coount questions
router.get('/count', countQuestions);

// get a question by id
router.get('/:id', getQuestionById);

//create a question
router.post('/', authentification ,createQuestion);  


export default router