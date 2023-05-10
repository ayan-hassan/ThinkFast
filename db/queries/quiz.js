const { Pool } = require('pg');

const pool = new Pool({
  user: 'ayanhassan',
  host: 'localhost',
  database: 'midterm'
});

const getQuizById = (req, res) => {
  const id = req.params.id;
  return pool
    .query(`
    SELECT *
    FROM quizzes
    WHERE quizzes.id = $1`,
    [id])
    .then(result => console.log(result.rows[0]))
    .catch(err => null);
};

module.exports = {getQuizById};
