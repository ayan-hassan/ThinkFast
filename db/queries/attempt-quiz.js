const db = require('../connection');

const getQuizData = function(quiz_id) {

  const queryString = `
  SELECT users.name, quizzes.title, quizzes.description
  FROM quizzes
  JOIN users ON creator_id = users.id
  WHERE quizzes.id = $1;
  `;

  return db.query(queryString, [quiz_id])

};

const getQuestionsForQuiz = function(quiz_id) {

  const queryString = `
  SELECT id, question
  FROM questions
  WHERE quiz_id = $1;
  `;

  return db.query(queryString, [quiz_id]);

};

const getChoices = function(questionIDS) {

  const queryString = `
  SELECT question_id, option, is_correct
  FROM choices
  WHERE question_id IN ${questionIDS};
  `;

  return db.query(queryString);

};


module.exports = { getQuizData, getQuestionsForQuiz, getChoices };
