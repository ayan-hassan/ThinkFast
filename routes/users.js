/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into /users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

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

  res.render('users', templateVars);
});

module.exports = router;
