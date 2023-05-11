const db = require('../connection');

const getAllQuizzes = () => {
  const queryString = `
  SELECT title, categories.name AS category, users.name AS author, photo_url, quizzes.id AS id
  FROM quizzes
  JOIN categories ON categories.id = category_id
  JOIN users ON users.id = creator_id
  WHERE is_unlisted = false
  ORDER BY created_at DESC;
  `;

  return db.query(queryString);
}

const getRandomQuiz = () => {
  const queryCount = `
  SELECT COUNT(id)
  FROM quizzes
  WHERE is_unlisted = false;
  `;

  const queryString = `
  SELECT title, categories.name AS category, users.name AS author, photo_url, quizzes.id AS id
  FROM quizzes
  JOIN categories ON categories.id = category_id
  JOIN users ON users.id = creator_id
  WHERE quizzes.id = $1;
  `;

  return db.query(queryCount)
    .then(result => {
      const count = Number(result.rows[0].count);
      const randomNum = Math.ceil(Math.random() * count);
      return randomNum;
    })
    .then(randomNum => {
      return db.query(queryString, [randomNum])
    })
    .catch(err => console.log(err));
};

getRandomQuiz();

module.exports = { getAllQuizzes, getRandomQuiz };
