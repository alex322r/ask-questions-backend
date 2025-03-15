import express from 'express';
import { json } from 'express';
import morgan from 'morgan';
import questionsRoute from './src/routes/questions.js';
import answerRoute from './src/routes/answers.js';
import pool from './db.js';
import cors from 'cors';


const app = express();

app.use(morgan('dev'));
app.use(json());
app.use(cors())

app.use('/api/v1/questions', questionsRoute);
app.use('/api/v1/answers', answerRoute);


process.on('SIGINT', async () => {
    console.log('shutting down');
    await pool.end();
    process.exit();
})


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

