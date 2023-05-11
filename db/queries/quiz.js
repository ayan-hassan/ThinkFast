const db = require('../connection');

const getCategories = function() {
 return db
  .query(`SELECT name FROM categories`)

}

const displayTimeLimit = function() {
  const time_limit =  //get timelimit from DB
}



module.exports = {getCategories}
