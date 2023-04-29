const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
require("dotenv").config();
const SECRET = process.env.JWT_SECRET;

const db = require('../database/connection');
function validatePUTRequest(req, res, next) {
  if (req.body.name && req.body.age&&req.body.gender) {
    return next();
  }

  return res.status(400).json({ message: "Error validating" });
}
// UPDATE USER INFO
router.put('/:id', validatePUTRequest,function (req, res, next) {
  // Write your code here
  const  {name,age,gender} = req.body
  user_id = req.params.id;
  const userData = {
    gender,
    name,
    age,
  };
  //is valid PUT information 
  if (name.length < 2) {
    return res
      .status(400)
      .json({ error: "Name must be at least 2 characters long" });
  }
  if (typeof age !== "number" && age < 0) {
    return res.status(400).json({ error: "Age must be a positive number" });
  }
  
  //Verify token
  const authorizationHeader = req.headers.authorization;
  const userToken = authorizationHeader.substring(7);
  try {
      const isTokenValid = jwt.verify(userToken, SECRET);
      
      // Authorization success
      if (isTokenValid.userId == user_id) {
       
          //update user information
          db.query('UPDATE users SET name = ?, age = ?, gender = ? WHERE id = ?', [name, age,gender, user_id],(error, results, fields) => {
            if (error) {
              return res.status(500).json({ error: "Internal server error" });
            }
            res.status(200).json({message: "Registration successful"})
          }
            );
            
      }
      else

      // Authorization failed
      return res.status(401).json({
          message: 'unauthorized',
      });
  } catch (error) {
      return res.status(401).json({
          message: error.message,
      });
  }
  }




);

module.exports = router;
