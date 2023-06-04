const knex = require('knex');
const db = knex({
    client: 'mysql',
    connection: {
      host : process.env.DB_HOST,
      port : 3306,
      user : process.env.DB_USER,
      password : process.env.DB_PASSWORD,
      database : process.env.DB,
    }
  });

  db.raw('SELECT 1')
  .then(() => {
    console.log('Connected to Knex Database');
  })
  .catch((err) => {
    throw err;
  });

module.exports  = db;