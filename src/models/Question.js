import pool from "../../db.js"

const Question = {

    async create(title, description, userId) {
        const client = await pool.connect();
        try {
            const { rows } = await client.query('INSERT INTO questions (title, description) VALUES ($1, $2) RETURNING *', [title, description]);
            return rows[0];
        } catch (error) {
            throw error;
        } finally {
            client.release();
        }
    },

    async getQuestionById(id) {
        const client = await pool.connect();
        try {
            const { rows } = await client.query('SELECT * FROM get_question_and_increment_views($1)', [id]);
            return rows[0];
        } catch (error) {
            throw error;
        } finally {
            client.release();
        }
    },

    async getQuestions(page, limit) { 
        const client = await pool.connect();
        const offset = (page - 1) * limit;
        console.log({ offset, limit });
        try {
            const { rows } = await client.query('SELECT id, title, description, user_id, created_at, view_count FROM questions ORDER BY created_at ASC LIMIT $1 OFFSET $2', [ limit, offset]);
            console.log(new  Date());
            return rows;
        } catch (error) {
            throw error;
        } finally {
            client.release();
        }
    },

    async countQuestions() {
        const client = await pool.connect();
        try {
            const { rows } = await client.query('SELECT count FROM row_count WHERE table_name = $1', ['questions']);
            console.log({ rows });
            return parseInt(rows[0].count);
        } catch (error) {
            throw error;
        } finally {
            client.release();
        }
    }
}

export default Question;