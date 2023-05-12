const db = require('../connection');

const getQuizData = function(quiz_id) {

  const queryString =
`  SELECT users.name, quizzes.title, quizzes.description
  FROM quizzes
  JOIN users ON creator_id = users.id
  WHERE quizzes.id = $1;`
  ;

  return db.query(queryString, [quiz_id])

};

const getQuestionsForQuiz = function(quiz_id) {

  const queryString =
  `SELECT id, question
  FROM questions
  WHERE quiz_id = $1;`
  ;

  return db.query(queryString, [quiz_id]);

};

const getChoices = function(questionIDS) {

  const queryString =
  `SELECT question_id, option, is_correct
  FROM choices
  WHERE question_id IN ${questionIDS};`
  ;

  return db.query(queryString);

};




const getCorrectAnswers = function(quiz_id) {

  const queryString =
  `SELECT option, is_correct
  FROM quizzes
  JOIN questions ON quiz_id = quizzes.id
  JOIN choices ON question_id = questions.id
  JOIN users ON creator_id = users.id
  WHERE quizzes.id = $1
  AND is_correct = 'true';`
  ;

  return db.query(queryString, [quiz_id]);

}





///this one

const submitQuizAttempt = function(user_id, quiz_id, user_score, max_score) {

  console.log("user_id:", user_id);
  console.log("quiz_id:", quiz_id);
  console.log("Inside submit function:", user_score);

  const queryString =
    `INSERT INTO user_quiz_taken (user_id, quiz_id, user_score, max_score)
    VALUES ($1, $2, $3, $4)
    RETURNING id;`
  ;

  return db.query(queryString, [user_id, quiz_id, user_score, max_score]);
};









const getQuizAttempt = function(attempt_id) {

  const queryString =
  `SELECT user_score, max_score, quizzes.title AS quiz_title, users.name AS user
  FROM user_quiz_taken
  JOIN quizzes ON quizzes.id = quiz_id
  JOIN users ON users.id = user_id
  WHERE user_quiz_taken.id = $1;`
  ;

  return db.query(queryString, [attempt_id]);

};


module.exports = { getCorrectAnswers, submitQuizAttempt, getQuizAttempt, getQuizData, getQuestionsForQuiz, getChoices };



