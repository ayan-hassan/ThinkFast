const db = require('../connection');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'labber',
  password: '123',
  host: 'localhost',
  database: 'midterm'
});

const queryUser = (id) => {
  const queryString = `
  SELECT *
  FROM users
  WHERE id = ${id};
  `;

  return pool.query(queryString);
};

const queryUserQuizzes = (id) => {
  const queryString = `
  SELECT photo_url, title, categories.name AS category
  FROM quizzes
  JOIN categories ON categories.id = category_id
  WHERE creator_id = ${id}
  ORDER BY created_at DESC;
  `;

  return pool.query(queryString);
};

const queryUserHistory = (id) => {
  const queryString = `
  SELECT photo_url, title, categories.name AS category
  FROM user_quiz_taken
  JOIN quizzes ON quizzes.id = quiz_id
  JOIN categories ON categories.id = category_id
  WHERE user_id = ${id}
  ORDER BY taken_at DESC;
  `;

  return pool.query(queryString);
}

module.exports = { pool, queryUser, queryUserQuizzes, queryUserHistory };
