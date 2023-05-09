const { response } = require('express');
const express = require('express');
const db = require('../db/connection');
// const quizQuery = require('../db/queries/quiz');
const router  = express.Router();

router.get('/', (req, res) => {
  res.redirect('index');
  //if logged in - redirect '/create' else redirect 'login'
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
      const templateVars = {quiz:quiz};
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
