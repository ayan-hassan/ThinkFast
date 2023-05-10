const express = require('express');
const db = require('../db/connection');
const router  = express.Router();
const bcrypt = require('bcryptjs');
const cookieSession = require('cookie-session');

const app = express();

app.use(cookieSession({
  name: 'session',
  keys: ['123', '456', '789']
}));

router.get('/', (req, res) => {

  if (req.session.user_id) {
    res.redirect('/');
    return;
  }

  const templateVars = { loggedIn: false };

  res.render('login', templateVars);
});

router.post('/', (req, res) => {

  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).send("Please fill in all fields");
    return;
  }

  const queryString = `
  SELECT id, email, password
  FROM users
  WHERE email = $1
  `;

  db.query(queryString, [email])
    .then(result => {
      return user = result.rows[0];
    })
    .then(user => {
      return bcrypt.compare(password, user.password)
    })
    .then(result => {
      if (result) {
        req.session.user_id = user.id;
        res.redirect(`/users/${user.id}`);
      } else {
        throw Error;
      }
    })
    .catch(() => res.status(403).send("Error logging in, try again"));

});

module.exports = router;
