const express = require('express');
const router  = express.Router();

router.get('/', (req, res) => {
  res.redirect('index');
  //if logged in - redirect '/create' else redirect 'login'
});

router.get('/create', (req, res) => {
  res.render('create');
});

router.get('/:id', (req, res) => {
  res.render('attempt');
});

router.get('/results/:id', (req, res) => {
  res.render('results');
});


module.exports = router;
