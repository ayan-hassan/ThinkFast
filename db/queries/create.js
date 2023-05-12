const db = require('../connection');

const insertQuiz = function(quiz, user_id) {

  const queryCategories = `
  SELECT id
  FROM categories
  WHERE name = $1;
  `;

  const queryString = `
  INSERT INTO quizzes (title, category_id, description, photo_url, is_unlisted, creator_id, time_limit)
  VALUES ($1, $2, $3, $4, $5, $6, $7)
  RETURNING id;
  `;

  return db.query(queryCategories, [quiz.category])
    .then(result => {
      const category_id = result.rows[0];
      const is_unlisted = quiz.unlisted? true : false;
      return db.query(queryString, [quiz.quiz_name, category_id.id, quiz.description, quiz.thumbnail, is_unlisted, user_id, quiz.time_limit]);
    })
    .catch(err => console.log(err));

};

const insertQuestions = function(question_text, quiz_id) {

  const queryString = `
  INSERT INTO questions (quiz_id, question)
  VALUES ($1, $2)
  RETURNING id;
  `;

  return db.query(queryString, [quiz_id, question_text]);

};

const insertOptions = function(option_text, question_id, is_correct) {

  const queryString = `
  INSERT INTO choices (option, question_id, is_correct)
  VALUES ($1, $2, $3);
  `;

  return db.query(queryString, [option_text, question_id, is_correct]);

};

module.exports = { insertQuiz, insertQuestions, insertOptions };
