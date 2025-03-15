// question routes
import { Router } from 'express';
import { createQuestion, getQuestions, getQuestionById, countQuestions } from '../controllers/questionsController.js';

const router = Router();


router.get('/', getQuestions);

// coount questions
router.get('/count', countQuestions);

// get a question by id
router.get('/:id', getQuestionById);

//create a question
router.post('/', createQuestion);  


export default router