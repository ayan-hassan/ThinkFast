/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into /users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const { queryUser, queryUserQuizzes, queryUserHistory } = require('../db/queries/users');

router.get('/', (req, res) => {

  if (req.session.user_id) {
    res.redirect(`/users/${req.session.user_id}`);
  } else {
    res.redirect('/');
  }
});

router.get('/:id', (req, res) => {

  if (!req.session.user_id) {
    res.redirect('/');
  }

  const templateVars = {
    loggedIn: true
  };

  const userID = req.session.user_id;

  queryUser(userID)
    .then(result => {
      templateVars.user = result.rows[0];
      return queryUserQuizzes(userID);
    })
    .then(result => {
      templateVars.userQuizzes = result.rows;
      return queryUserHistory(userID);
    })
    .then(result => {
      templateVars.userHistory = result.rows;
    })
    .then(() => {
      res.render('users', templateVars);
    })
    .catch(err => console.log(err.message));

});

module.exports = router;
