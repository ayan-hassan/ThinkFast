const express = require('express');
const router  = express.Router();
const {getCategories} = require('../db/queries/quiz')
const {insertQuiz, insertQuestions, insertOptions} = require('../db/queries/create')


router.get('/', (req, res) => {
  res.redirect('index');
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
  res.render('attempt');
});

router.get('/results/:id', (req, res) => {
  res.render('results');
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
