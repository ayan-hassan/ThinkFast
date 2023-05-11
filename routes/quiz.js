const express = require('express');
const db = require('../db/connection');
const router  = express.Router();
const {getCategories} = require('../db/queries/quiz')
const {insertQuiz, insertQuestions, insertOptions} = require('../db/queries/create')
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
    console.log(questionGroup);
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
      console.log(quiz);
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

router.post('/:id', (req, res) => {
  let userResponse = req.body;
  const id = req.params.id;

  //query database for correct answers

  return db.query(`
    SELECT option, is_correct
    FROM quizzes
    JOIN questions ON quiz_id = quizzes.id
    JOIN choices ON question_id = questions.id
    JOIN users ON creator_id = users.id
    WHERE quizzes.id = $1
    AND is_correct = 'true'`, [id])
    .then(data => {
      const answers = data.rows;


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
      console.log(totalCorrectAnswers);
      return totalCorrectAnswers;
    })
    .then((response) => res.send({ response }));//send quiz results to client side
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
      console.log("Query finished")
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
