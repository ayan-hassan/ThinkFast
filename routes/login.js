const express = require('express');
const { Pool } = require('pg');
const router  = express.Router();
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

  const templateVars = {user: {}};

  res.render('login', templateVars);
});

router.post('/', (req, res) => {

  const { email, password } = req.body;

  console.log(req.body);

  if (!email || !password) {
    res.status(400).send("Please fill in all fields");
    return;
  }

  const queryString = `
  SELECT id, email, password
  FROM users
  WHERE email = $1
  `;

  pool.query(queryString, [email])
    .then(user => {
      console.log(user.rows[0]);

      bcrypt.compare(password, user.rows[0].password)
      .then((result) => {
        console.log('Result of bcrypt compare:', result);
        if (result) {
          req.session.user_id = user.id;
          res.redirect(`/users/${user.id}`);
        } else {
          throw Error;
        }
      })
    })
    .catch(() => res.status(403).send("User not found"));

});

module.exports = router;
