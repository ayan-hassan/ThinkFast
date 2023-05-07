const express = require('express');
const { Pool } = require('pg');
const router  = express.Router();
const bcrypt = require('bcryptjs');
const cookieSession = require('cookie-session');

const app = express();

const pool = new Pool({
  user: 'labber',
  password: '123',
  host: 'localhost',
  database: 'midterm'
});

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

  console.log(req.body);

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
  Values ($1, $2, $3);
  `;

  // check if email already exists
  pool.query(checkForUser, [email])
    .then(result => {
      console.log(result.rows);
      console.log(result.rows.length);
      if (result.rows.length === 0) {
        return;
      } else {
        // if it exists, exit
        console.log("User email found in db");
        throw Error;
      }
    })
    .then(() => {
      console.log("hashing password");
      bcrypt.hash(password, 10, (err, hash) => {
        console.log("Is there error?", err);
        console.log("Got hash:", hash);
        if (err) {
          throw Error;
        }
        console.log("Adding user to db");
        pool.query(addUser, [username, email, hash])
        .then(() => {
          console.log("Get new user id");
          pool.query(`SELECT id FROM users WHERE email = $1`, [email])
          .then(result => {
            console.log(result.rows[0]);
            const new_id = result.rows[0].id;
            req.session.user_id = new_id;
            res.redirect(`/users/${new_id}`);
          })
        })
      })
    })
    .catch(() => res.status(403).send("Cannot create new user"));
});

module.exports = router;
