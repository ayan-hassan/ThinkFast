const express = require('express');
const db = require('../db/connection');
const router  = express.Router();
const {getCategories} = require('../db/queries/quiz');
const {insertQuiz, insertQuestions, insertOptions} = require('../db/queries/create');
const cookieSession = require('cookie-session');
const { getCorrectAnswers, submitQuizAttempt } = require('../db/queries/submit');
const { getQuizData, getQuestionsForQuiz, getChoices } = require('../db/queries/attempt-quiz');

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
  // console.log(getCategories())
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

  const quiz_id = req.params.id;

  const templateVars = {
    loggedIn
  };

  getQuizData(quiz_id)
    .then(quizData => {
      templateVars.quizData = quizData.rows[0];
      return getQuestionsForQuiz(quiz_id);
    })
    .then(result => {
      let questions = result.rows;
      templateVars.questions = questions;

      let questionIDS = '(';
      for (let q = 0; q < questions.length; q++) {
        questionIDS += questions[q].id;
        if (q === questions.length - 1) {
          questionIDS += `)`;
        } else {
          questionIDS += `, `;
        }
      }
      return getChoices(questionIDS);
    })
    .then(result => {
      let options = result.rows;
      templateVars.options = options;
      console.log("templateVars:", templateVars);
    })
    .then(() => {
      // console.log("templateVars:", templateVars);
      res.render('attempt', templateVars);
    })




    .catch(err => console.log(err));
});

router.get('/results/:id', (req, res) => {
  res.render('results');
});

router.post('/:id', (req, res) => {
  let userResponse = req.body;
  const quiz_id = req.params.id;
  let user_id;

  if (req.session.user_id) {
    user_id = req.session.user_id;
  } else {
    user_id = 0;
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
        // console.log(numOfQuestion.length);
        for (const response in userResponse) {
          let userAnswer = userResponse[response];
          // console.log(userResponse[response]);
          if (correctAnswer === userAnswer) {
            totalCorrectAnswers++;
          }
        }
      }
      return totalCorrectAnswers;
    })
    .then(correctCount => {
      user_score = correctCount;
      console.log("Before submitting:", user_score);
      submitQuizAttempt(user_id, quiz_id, user_score, answers.length);
    })
    .then(attempt_id => {
      console.log("After insert:");
      console.log("user_score:", user_score);
      console.log("After insert:", attempt_id);
      res.send({ user_score, attempt_id });//send quiz results to client side
    })
    .catch(err => console.log(err));
  });

router.post('/submit', (req, res) => {
  const quiz = req.body;

  insertQuiz(quiz, req.session.user_id)
    .then(result => {
      const quiz_id = result.rows[0].id;
      console.log("query done");
      for (let value of Object.values(quiz)) {
        console.log("value", value);
        console.log("quiz id", quiz_id);
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
    .catch(err => console.log(err));


  res.redirect(`/users/${req.session.user_id}`);
  //later redirect to user/:id
})

// {
//   quiz_name: 'Test Quiz',
//   category: 'History',
//   thumbnail: 'thumb',
//   description: 'asdasd',
//   time_limit: '33',
//   unlisted: 'on',
//   question1: [ 'A', '1', '$%**%$', '2', '3' ],
//   question2: [ 'B', '4', '5', '$%**%$', '6' ],
//   question3: [ 'C', '7', '8', '9', '$%**%$' ]
// }


module.exports = router;
