import Answer from "../models/Answer.js";

export async function createAnswer(req, res) {


    const content = req.body.content;
    const questionId = req.params.questionId;
    const userId = req.user?.id;
    if (!content) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }
    if (!questionId) {
        return res.status(400).json({ message: 'Please enter question id' });
    }
    try {
        const answer = await Answer.create(content, questionId, userId);
        return res.status(201).json(answer);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'An error occurred' });
    }

};
