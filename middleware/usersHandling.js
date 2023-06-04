const db = require("../database/connection");
const knexDb = require("../database/knexConn");
function updateUserInfo(req, res, next) {
  // Write your code here
  const { name, age, gender } = req.body;
  user_id = req.params.id;
  const userData = {
    gender,
    name,
    age,
  };

  db.query(
    "UPDATE users SET name = ?, age = ?, gender = ? WHERE id = ?",
    [name, age, gender, user_id],
    (error, results, fields) => {
      if (error) {
        return res.status(500).json({ error: "Internal server error" });
      }
      res.status(200).json({ message: "Registration successful" });
    }
  );
}
function updateUserInfoUsingKnex(req, res, next) {
  const { name, age, gender } = req.body;
  const user_id = req.params.id;
  const userData = {
    gender,
    name,
    age,
  };

  knexDb('users')
    .where('id', user_id)
    .update(userData)
    .then(() => {
      res.status(200).json({ message: "Update successful" });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    });
}
function deleteUser(req, res, next) {
  const user_id = req.params.id;
  console.log(user_id)
  knexDb('users')
    .where('id', user_id)
    .del()
    .then((rowCount) => {
      if (rowCount === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(200).json({ message: "User deleted successfully" });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    });
}

function searchUsers(req, res, next) {
  const searchTerm = req.query.name;
  console.log(searchTerm);
  const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
  const limit = parseInt(req.query.limit) || 5; // Default to 5 users per page if not provided
  const offset = (page - 1) * limit;

  knexDb('users')
    .where('name', 'like', `%${searchTerm}%`)
    .limit(limit)
    .offset(offset)
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    });
}
module.exports = { updateUserInfo,updateUserInfoUsingKnex,deleteUser,searchUsers};
