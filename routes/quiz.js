const express = require('express');
const db = require('../db/connection');
const router  = express.Router();
const {getCategories} = require('../db/queries/quiz')
const {insertQuiz, insertQuestions, insertOptions} = require('../db/queries/create')
const {getCorrectAnswers, submitQuizAttempt, getQuizAttempt, getQuizData, getQuestionsForQuiz, getChoices} = require('../db/queries/results')
const cookieSession = require('cookie-session');

const app = express();

app.use(cookieSession({
  name: 'session',
  keys: ['123', '456', '789']
}));

router.get('/', (req, res) => {

  if (req.session.user_id) {
    res.redirect('/quiz/create')
  }

  res.redirect('/login');
  //if logged in - redirect '/create' else redirect 'login'
});


router.get('/create', (req, res) => {

  let loggedIn = false;
  if (req.session.user_id) {
    loggedIn = true;
  }

  const templateVars = {
    loggedIn
  };

if(!loggedIn) {
  res.redirect('/login');
}
  getCategories()
  .then(result => {
    const categories = result.rows
    res.render('create', {categories, loggedIn});
  })
  .catch(err => console.error(err.message));

});

router.get('/:id', (req, res) => {

  let loggedIn = false;
  if (req.session.user_id) {
    loggedIn = true;
  }

  const groupQuestions = (quiz) => {
    //declare the expty object variable to hold results
    const questionGroup = {};
    //loop through quiz result and if the question_id doesn't exist, add it as an object to hold the question_id and options(as an array)
    for (const question of quiz) {
      if (!questionGroup[question.question_id]) {
        questionGroup[question.question_id] = {question: question.question, question_id: question.question_id, choices: []};
      }
      // if question_id doesn't exist
      questionGroup[question.question_id].choices.push(question.option);
    }
    return questionGroup;
  };

  const id = req.params.id;
  db.query(`
  SELECT users.name, quizzes.id AS quiz_id, quizzes.title, quizzes.description, quizzes.time_limit, questions.*, choices.*
  FROM quizzes
  JOIN questions ON quiz_id = quizzes.id
  FULL OUTER JOIN choices ON question_id = questions.id
  JOIN users ON creator_id = users.id
  WHERE quizzes.id = $1`, [id])
    .then(data => {
      const quiz = data.rows;
      const questions = groupQuestions(quiz);
      const templateVars = {questions, quiz:quiz, quizId:id, loggedIn};
      res.render('attempt', templateVars);
    })
    .catch(err => {
      res
        .status(500)
        .json({error:err.message});
    });
});

router.get('/results/:id', (req, res) => {
  res.render('results');
});





router.post('/submit', (req, res) => {
  const quiz = req.body;
  insertQuiz(quiz, req.session.user_id)
  .then(result => {
    const quiz_id = result.rows[0].id;
      for (let value of Object.values(quiz)) {
        if (typeof(value) === 'object') {
          insertQuestions(value[0], quiz_id)
          .then(result => {
            const question_id = result.rows[0].id;
            for (let i = 1; i < value.length; i++) {
              if (value[i] === '$%**%$') {
                continue;
              }

              let is_correct = false;
              if (value[i + 1] === '$%**%$') {
                is_correct = true;
              }

              insertOptions(value[i], question_id, is_correct)

            }
          })
        }

      }
    })
    .then(() => res.redirect(`/users/${req.session.user_id}`))
    .catch(err => console.log(err));

  })

  router.post('/:id', (req, res) => {
    let userResponse = req.body;
    const quiz_id = req.params.id;
    let user_id;

    if (req.session.user_id) {
      user_id = req.session.user_id;
    } else {
      user_id = 1;
    }

    //query database for correct answers

    let answers;
    let user_score;

    getCorrectAnswers(quiz_id)
      .then(data => {
        answers = data.rows;

        //compare answers to database

        let totalCorrectAnswers = 0;
        for (const index in answers) {
          let correctAnswer = answers[index].option;
          for (const response in userResponse) {
            let userAnswer = userResponse[response];
            if (correctAnswer === userAnswer) {
              totalCorrectAnswers++;
            }
          }
        }
        return totalCorrectAnswers;
      })
      .then(correctCount => {
        user_score = correctCount;
        return submitQuizAttempt(user_id, quiz_id, user_score, answers.length);
      })
      .then(response => {
        let attempt_id = response.rows[0].id
        res.send({ user_score, attempt_id, answers });//send quiz results to client side
      })
      .catch(err => console.log(err));
  });

module.exports = router;
