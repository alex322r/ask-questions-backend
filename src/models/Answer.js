import pool from "../../db.js";

const Answer = {
    async create(content, questionId, userId) {
        const client = await pool.connect();
        try {
            const { rows } = await client.query('INSERT INTO answers (content, question_id, user_id) VALUES ($1, $2, $3) RETURNING *', [content, questionId, userId]);
            return rows[0];
        } catch (error) {
            throw error;
        } finally {
            client.release();
        }
    },
}

export default Answer;