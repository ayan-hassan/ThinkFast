const db = require('../connection');

const getCategories = function() {
 return db
  .query(`SELECT name FROM categories`)

}

module.exports = {getCategories}
