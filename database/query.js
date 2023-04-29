const db = require('./connection');


function get_user(username)  {
    let sql = 'SELECT * FROM users WHERE username = ?';
    db.query(sql, [username],function(err, results){
          if (err){ 
            throw err;
          }
        return results
    
  })
    console.log(data);
    return data;
  }


  module.exports = {get_user}