const db = require('../connection');

const getCategories = function() {
 return db
  .query(`SELECT name FROM categories`)

}

const publishQuiz = function(obj) {

}

module.exports = {getCategories}
