const express = require('express');
const router  = express.Router();
const { Pool } = require('pg');
const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'lightbnb'
});



router.get('/', (req, res) => {
  res.redirect('index');
  //if logged in - redirect '/create' else redirect 'login'
});

const getCatagories = function() {
 return pool
  .query(`SELECT name FROM categories`)
  .then((result) => {

    return result.rows[0];
  })
  .catch(err => console.error(err.message));

}

router.get('/create', (req, res) => {
  console.log(getCatagories())
  res.render('create');
});

router.get('/:id', (req, res) => {
  res.render('attempt');
});

router.get('/results/:id', (req, res) => {
  res.render('results');
});

router.get('/submit', (req, res) => {

  res.redirect('/users/:id')
})


module.exports = router;
