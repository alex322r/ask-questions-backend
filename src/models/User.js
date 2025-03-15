import pool from "../../db.js"


const User = {
    async create(username, password) {
        const client = await pool.connect();
        try {
            const { rows } = await client.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *', [username, password]);
            return rows[0];
        } catch (error) {
            throw error;
        } finally {
            client.release();
        }

    }
}