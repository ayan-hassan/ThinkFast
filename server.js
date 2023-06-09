// load .env data into process.env
require('dotenv').config();

// Web server config
const sassMiddleware = require('./lib/sass-middleware');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const db = require('./db/connection');

const PORT = process.env.PORT || 8080;
const app = express();

app.set('view engine', 'ejs');

const { getAllQuizzes, getRandomQuiz, getQuizByCategory } = require('./db/queries/index');
const { getCorrectAnswers, submitQuizAttempt, getQuizAttempt, getQuizData, getQuestionsForQuiz, getChoices } = require('./db/queries/results');

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  '/styles',
  sassMiddleware({
    source: __dirname + '/styles',
    destination: __dirname + '/public/styles',
    isSass: false, // false => scss, true => sass
  })
);
app.use(express.static('public'));
app.use(cookieSession({
  name: 'session',
  keys: ['123', '456', '789']
}));

// app.use(express.static(__dirname +'../scripts'));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const userApiRoutes = require('./routes/users-api');
const widgetApiRoutes = require('./routes/widgets-api');
const usersRoutes = require('./routes/users');
const loginRoutes = require('./routes/login');
const registerRoutes = require('./routes/register');
const logoutRoutes = require('./routes/logout');
const quizRoutes = require('./routes/quiz');
// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
// Note: Endpoints that return data (eg. JSON) usually start with `/api`
app.use('/api/users', userApiRoutes);
app.use('/api/widgets', widgetApiRoutes);
app.use('/users', usersRoutes);
app.use('/login', loginRoutes);
app.use('/register', registerRoutes);
app.use('/logout', logoutRoutes);
app.use('/quiz', quizRoutes);
// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.get('/', (req, res) => {

  let loggedIn = false;
  if (req.session.user_id) {
    loggedIn = true;
  }

  const templateVars = {
    loggedIn,
    attemptData: {user: "henry",
    quiz_title: null,
  user_score: null,
nax_score: null}
  };

  getAllQuizzes()
    .then(result => {
      templateVars.quizzes = result.rows;
      return getRandomQuiz();
    })
    .then(result => {
      templateVars.featured = result.rows[0];
    })
    .then(() => {
      res.render('index', templateVars);
    })
    .catch(err => console.log(err));

});

app.get('/reload', (req, res) => {
  const category = req.query.category;
  getQuizByCategory(category)
    .then(response => {
      return res.send(response.rows);
    })
    .catch(err => {
      console.log(err);
      return res.status(400).send(err);
    });
});


app.get('/:id', (req, res) => {

  const attempt_id = req.params.id;

  let loggedIn = false;
  if (req.session.user_id) {
    loggedIn = true;
  }

  const templateVars = {
    loggedIn
  };

  getQuizAttempt(attempt_id)
    .then(response => {
      templateVars.attemptData = response.rows[0];
      console.log("Graydon right here: ", templateVars.attemptData)
      return getAllQuizzes()
    })
    .then(result => {
      templateVars.quizzes = result.rows;
      return getRandomQuiz();
    })
    .then(result => {
      templateVars.featured = result.rows[0];
    })
    .then(() => {
      res.render('index', templateVars);
      // const modal = document.querySelector('#modal')
      // modal.showMOdal()
      // $('.modal').toggleClass('hidden');
    })
    .catch(err => console.log(err));
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
