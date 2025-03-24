import express from 'express';
import { json } from 'express';
import morgan from 'morgan';
import questionsRoute from './src/routes/questions.js';
import answerRoute from './src/routes/answers.js';
import authRoute from './src/routes/auth.js'
import pool from './db.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';


const app = express()

app.use(morgan('dev'))
app.use(json())
app.use(cors({
    origin: process.env.ENV === 'development' ? 'http://localhost:5173' : 'https://ask-questions-backend.onrender.com',
    credentials: true
}))
app.use(cookieParser())


app.use('/api/v1', authRoute  )

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

