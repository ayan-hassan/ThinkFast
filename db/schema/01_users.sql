-- Drop and recreate Users table (Example)

DROP TABLE IF EXISTS users, categories, quizzes, user_quiz_taken, favourites, questions, choices, user_quiz_taken_details CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  profile_img VARCHAR(255)
);

CREATE TABLE categories (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE quizzes (
  id SERIAL PRIMARY KEY NOT NULL,
  creator_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255),
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  description TEXT,
  photo_url VARCHAR(255) DEFAULT 'https://t3.ftcdn.net/jpg/02/66/33/82/360_F_266338299_wTr8tcMGNmjFbEJVnrkKXrrsHABMlqXY.jpg',
  is_unlisted BOOLEAN,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_quiz_taken (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  quiz_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
  taken_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE favourites (
  quiz_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE questions (
  id SERIAL PRIMARY KEY NOT NULL,
  quiz_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
  question VARCHAR(255)
);

CREATE TABLE choices (
  id SERIAL PRIMARY KEY NOT NULL,
  option VARCHAR(255),
  question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
  is_correct BOOLEAN DEFAULT false
);

CREATE TABLE user_quiz_taken_details (
  id SERIAL PRIMARY KEY NOT NULL,
  user_quiz_taken_id INTEGER REFERENCES user_quiz_taken(id) ON DELETE CASCADE,
  question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
  user_answer INTEGER REFERENCES choices(id) ON DELETE CASCADE,
  correct_answer INTEGER REFERENCES choices(id) NOT NULL
);
