import Question from "../models/Question.js";
//import { groq } from "../services/llmService.js";
import Answer from "../models/Answer.js";


export async function createQuestion(req, res) {
  // create a new question
  const title = req.body.title;
  const description = req.body.description;

  const { user_id: userId } = req.user;
  const { guest_name: guestName } = req.user;


  if (!guestName && !userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (!title || !description) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  try {
    const question = await Question.create(title, description, userId, guestName);
    if (!question) {
      return res.status(400).json({ message: 'question failed' });
    }
    // const content = `${question.title} ${question.description}`;
    // const questionId = question.id;
    // const userId = question.user_id;
    //answerQuestion(content, questionId, userId);
    return res.status(201).json(question);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'internal server error' });
  }

}

// export async function answerQuestion (content,questionId, userId) { try {
//   const response = await ollama.chat({
//     model: 'deepseek-r1:7b',
//     messages: [
//       { role: 'system', content: 'Responde como si fueras un usuario activo en un foro. Usa respuestas cortas y simples, pero mantén un tono amigable.' },
//       { role: 'user', content: content}
//       ]
//   })
//   const answer = response.message.content.replace(/<think>[\s\S]*?<\/think>\s*/g, "");
//   console.log(answer);
//   await Answer.create(answer, questionId, userId);
// } catch (error) {
//   console.log(error);
// }
// }

export async function answerQuestion(content, questionId, userId) {
  try {
    const response = await groq.chat.completions.create({
      "messages": [
        {
          "role": "system",
          "content": "Responde como si fueras un usuario activo en un foro. Usa respuestas cortas y simples, pero mantén un tono amigable."
        },
        {
          "role": "user",
          "content": content
        }
      ],
      "model": "deepseek-r1-distill-llama-70b",
      "temperature": 0.6,
      "max_completion_tokens": 4096,
      "top_p": 0.95,
      "stream": false,
      "stop": null
    });
    const answer = response.choices[0].message.content.replace(/<think>[\s\S]*?<\/think>\s*/g, "");
    console.log(answer);
    await Answer.create(answer, questionId, userId);

  } catch (error) {
    console.log(error);
  }
}


export async function getQuestionById(req, res) {
  // get a question by id
  const id = req.params.id;
  try {
    const question = await Question.getQuestionById(id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    return res.status(200).json(question);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'An error occurred' });
  }
}

export async function getQuestions(req, res) {

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  
  try {
    const questions = await Question.getQuestions(page, limit);
    return res.status(200).json(questions);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'An error occurred' });
  }
}

export async function countQuestions(req, res) {
  try {
    const count = await Question.countQuestions();
    return res.status(200).json({ count });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'An error occurred' });
  }
}






