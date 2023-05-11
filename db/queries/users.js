const db = require('../connection');

const queryUser = (id) => {
  const queryString = `
  SELECT *
  FROM users
  WHERE id = ${id};
  `;

  return db.query(queryString);
};

const queryUserQuizzes = (id) => {
  const queryString = `
  SELECT photo_url, title, categories.name AS category, quizzes.id AS id
  FROM quizzes
  JOIN categories ON categories.id = category_id
  WHERE creator_id = ${id}
  ORDER BY created_at DESC;
  `;

  return db.query(queryString);
};

const queryUserHistory = (id) => {
  const queryString = `
  SELECT photo_url, title, categories.name AS category, quizzes.id AS id
  FROM user_quiz_taken
  JOIN quizzes ON quizzes.id = quiz_id
  JOIN categories ON categories.id = category_id
  WHERE user_id = ${id}
  ORDER BY taken_at DESC;
  `;

  return db.query(queryString);
}

module.exports = { queryUser, queryUserQuizzes, queryUserHistory };
