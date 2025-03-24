-- postgres
-- create api_db if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'api_db') THEN
        CREATE DATABASE api_db;
    END IF;
END $$;

\c api_db;

drop table if exists votes ;
drop table if exists answers;
drop table if exists questions;
drop table if exists users;
drop table if exists row_count;

CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    user_id UUID NULL,
    guest_name VARCHAR(30),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    view_count INTEGER DEFAULT 0,
    votes_count INTEGER DEFAULT 0,
    answers_count INTEGER DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT check_guest_name CHECK ((user_id IS NULL AND guest_name IS NOT NULL) OR (user_id IS NOT NULL AND guest_name IS NULL))
);



DROP FUNCTION IF EXISTS get_question_and_increment_views(integer);
CREATE OR REPLACE FUNCTION get_question_and_increment_views(p_id INT)
RETURNS TABLE (
    id INT,
    title VARCHAR(100),
    description TEXT,
    user_id UUID,
    created_at TIMESTAMP,
    view_count INT,
    votes_count INT,
    answers_count INT
) AS $$
BEGIN
    RETURN QUERY
    UPDATE questions q
    SET view_count = q.view_count + 1
    WHERE q.id = get_question_and_increment_views.p_id
    RETURNING q.id, q.title, q.description, q.user_id, q.created_at, q.view_count, q.votes_count, q.answers_count;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Question with id % not found', p_id;
    END IF;
END;
$$ LANGUAGE plpgsql;    


CREATE TABLE IF NOT EXISTS answers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content TEXT NOT NULL,
    score INTEGER DEFAULT 0,
    user_id UUID NULL,
    question_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (question_id) REFERENCES questions(id)
);

CREATE TABLE IF NOT EXISTS votes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    answer_id UUID NOT NULL,
    vote_type SMALLINT NOT NULL CHECK (vote_type IN (-1, 1)), -- -1 para downvote, 1 para upvote
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (answer_id) REFERENCES answers(id) ON DELETE CASCADE,
    UNIQUE (user_id, answer_id) -- Evita que un usuario vote más de una vez por la misma respuesta
);

CREATE TABLE IF NOT EXISTS row_count (
    table_name TEXT PRIMARY KEY,
    count BIGINT NOT NULL
);

CREATE OR REPLACE FUNCTION update_row_count() RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE row_count SET count = count + 1 WHERE table_name = TG_TABLE_NAME;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE row_count SET count = count - 1 WHERE table_name = TG_TABLE_NAME;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;




CREATE TRIGGER update_row_count_trigger
AFTER INSERT OR DELETE ON questions
FOR EACH ROW
EXECUTE FUNCTION update_row_count();

CREATE TRIGGER update_row_count_trigger
AFTER INSERT OR DELETE ON answers
FOR EACH ROW
EXECUTE FUNCTION update_row_count();

CREATE TRIGGER update_row_count_trigger
AFTER INSERT OR DELETE ON users
FOR EACH ROW    
EXECUTE FUNCTION update_row_count();


INSERT INTO row_count (table_name, count) VALUES ('questions', (SELECT COUNT(*) FROM questions));
INSERT INTO row_count (table_name, count) VALUES ('answers', (SELECT COUNT(*) FROM answers));
INSERT INTO row_count (table_name, count) VALUES ('users', (SELECT COUNT(*) FROM users));   



