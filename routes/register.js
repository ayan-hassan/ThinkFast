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

  res.render('register', templateVars);
});

router.post('/', (req, res) => {

  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400).send("Please fill in all fields");
    return;
  }

  const checkForUser = `
  SELECT email
  FROM users
  WHERE email = $1;
  `;

  const addUser = `
  INSERT INTO users (name, email, password)
  Values ($1, $2, $3)
  RETURNING id;
  `;

  db.query(checkForUser, [email])
    .then(result => {
      console.log(result.rows);
      if (result.rows.length === 0) {
        return;
      } else {
        throw Error;
      }
    })
    .then(() => {
      return bcrypt.hash(password, 10)
    })
    .then(result => {
      const hash = result;
      return db.query(addUser, [username, email, hash])
    })
    .then(result => {
      console.log(result.rows);
      const new_id = result.rows[0].id;
      req.session.user_id = new_id;
      res.redirect(`/users/${new_id}`);
    })
    .catch(() => res.status(403).send("Cannot create new user"));
});

module.exports = router;
