const { response } = require('express');
const express = require('express');
const db = require('../db/connection');
const router  = express.Router();

router.get('/', (req, res) => {
  res.redirect('index');
  //if logged in - redirect '/create' else redirect 'login'
});

router.post('/:id', (req, res) => {
  let userResponse = req.body;
  const id = req.params.id;

  //query database for correct answers

  db.query(`
    SELECT option, is_correct
    FROM quizzes
    JOIN questions ON quiz_id = quizzes.id
    JOIN choices ON question_id = questions.id
    JOIN users ON creator_id = users.id
    WHERE quizzes.id = $1
    AND is_correct = 'true'`, [id])
    .then(data => {
      const answers = data.rows;
      console.log(answers);

      //compare answers to database

      let totalCorrectAnswers = 0;
      const checkCorrectAnswers = () => {
        for (const index in answers) {
          // console.log(correct);
          let correctAnswer = answers[index].option;
          // console.log(correctAnswer);
          for (const response in userResponse) {
            let userAnswer = userResponse[response];
            // console.log(userResponse[response]);
            if (correctAnswer === userAnswer) {
              totalCorrectAnswers++;
            }
          }
        }
        console.log(totalCorrectAnswers);
      };
      checkCorrectAnswers();
    });
// .then(res.send(totalCorrectAnswers));//send quiz results to client side);
});


router.get('/create', (req, res) => {
  res.render('create');
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  db.query(`
  SELECT users.name, quizzes.id AS quiz_id, quizzes.title, quizzes.description, questions.*, choices.*
  FROM quizzes
  JOIN questions ON quiz_id = quizzes.id
  FULL OUTER JOIN choices ON question_id = questions.id
  JOIN users ON creator_id = users.id
  WHERE quizzes.id = $1`, [id])
    .then(data => {
      const quiz = data.rows;
      const templateVars = {quiz:quiz, quizId:id};
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


module.exports = router;
