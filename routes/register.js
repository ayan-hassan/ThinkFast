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
  res.render('register');
});

module.exports = router;
