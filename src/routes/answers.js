import { Router } from "express";
import { createAnswer } from "../controllers/answerController.js";

const router = Router();

//create an answer
router.post('/:questionId', createAnswer);

export default router;