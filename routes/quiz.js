const express = require('express');
const router  = express.Router();
const {getCategories} = require('../db/queries/quiz')


router.get('/', (req, res) => {
  res.redirect('index');
  //if logged in - redirect '/create' else redirect 'login'
});

router.get('/create', (req, res) => {
  console.log(getCategories())
  getCategories()
  .then(result => {
    const categories = result.rows
    res.render('create', {categories});
  })
  .catch(err => console.error(err.message));



});

router.get('/:id', (req, res) => {
  res.render('attempt');
});

router.get('/results/:id', (req, res) => {
  res.render('results');
});

router.post('/submit', (req, res) => {

console.log(req)
  res.redirect('/quiz/create')
  //later redirect to user/:id
})


module.exports = router;
