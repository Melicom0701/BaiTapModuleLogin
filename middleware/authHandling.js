require("dotenv").config();
const crypto = require("crypto");
const SECRET = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");
const hashPassword = require("../helpers/hash").hashPassword;
const comparePassword=require("../helpers/hash").comparePassword;
const db = require("../database/connection");
const { mailService } = require("../services/mail.service");
const  jwt_decode = require("jwt-decode");
const knexDb = require("../database/knexConn");

async function register(req, res, next) {
  // Get info from request body
  const { username, password, confirmPassword, email, gender, name, age } =
    req.body;
  // Check if user with that username already existed

  db.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    (error, results, fields) => {
      if (error) {
        return res.status(500).json({ error: "Internal server error" });
      }

      // If yes: Response to user
      else if (results.length > 0) {
        return res.status(400).json({ error: "Username already exists" });
      }
      // If no
      else {
        // + Hash password with random salt
        const { hashedPassword, salt } = hashPassword(password);
        // + Create user in db
        const userData = {
          username,
          hashedPassword,
          salt,
          email,
          gender,
          name,
          age,
        };

        // + Response to user
        db.query(
          "INSERT INTO users SET ?",
          [userData],
          (error, results, fields) => {
            if (error) {
              return res.status(500).json({ error: "Internal server error " });
            } else {
              return res
                .status(200)
                .json({ message: "Registration successful", data: userData });
            }
          }
        );
      }
    }
  );
}

function login(req, res, next) {
  // Get username, password from request body
  const { username, password } = req.body;
  // Check if user exists
  let sql = "SELECT * FROM users WHERE username = ?";
  db.query(sql, [username], function (err, results) {
    if (err) {
      throw err;
    }
    // If no: response with an error
    if (results.length == 0) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // If yes:
    user = results[0];
    // Compare password
    const isPasswordMatch = comparePassword(
      user.hashedPassword,
      user.salt,
      password
    );
    if (isPasswordMatch) {
      // If password is match: Sign a jwt and response
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      return res.status(200).json({ token });
    } else {
      // If password is not match: response with an error
      return res.status(401).json({ error: "Invalid username or password" });
    }
  });
}

function forgotPassword(req, res, next) {
  const email = req.body.email;
  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (error, results, fields) => {
      if (error) {
        return res.status(500).json({ error: "Internal server error" });
      } else if (results.length == 0) {
        return res.status(400).json({ error: "Email doesn't exits" });
      } else {
        const passwordResetToken = crypto.randomBytes(16).toString("hex");
        const passwordResetExpiration = new Date(Date.now() + 10 * 60 * 1000);
        const emailFrom = "melicom0701@gmail.com";
        const emailTo = email;
        const emailSubject = "Password Reset";
        const emailText = `This email to reset password, will be expired ultil ${passwordResetExpiration}
                      Reset password link : http://localhost:3000/auth/reset-password/${passwordResetToken}`;
        sendingData = { emailFrom, emailTo, emailSubject, emailText };

        try {
          await mailService.sendEmail(sendingData);
          //update secret token
          db.query(
            "UPDATE users SET passwordResetToken = ? , passwordResetExpiration = ? WHERE email = ? ",
            [passwordResetToken, passwordResetExpiration, email],
            (error, results, fields) => {
              if (error) {
                throw error;
              }
              res.status(200).json({ message: "successful" });
            }
          );
        } catch (err) {
          throw err;
        }
      }
    }
  );
}

async function resetPassword(req, res, next) {
  const passwordResetToken = req.params.passwordResetToken;
  const email = req.body.email;
  const newPassword = req.body.newPassword;
  const { hashedPassword, salt } = hashPassword(newPassword);
  db.query(
    "SELECT * FROM users WHERE email = ? AND passwordResetToken = ? AND passwordResetExpiration >? ",
    [email, passwordResetToken, new Date(Date.now())],
    (err, result, fields) => {
      if (err) throw err;
      else {
        if (result == 0) {
          res.status(400).json({ message: "not valid " });
        } else {
          // update password
          db.query(
            "UPDATE users SET hashedPassword = ?, salt = ?, passwordResetExpiration = ?  WHERE email = ? ",
            [hashedPassword, salt, new Date(Date.now()), email],
            (error, results, fields) => {
              if (error) {
                throw error;
              }
              res.status(200).json({ message: "successful" });
            }
          );
        }
      }
    }
  );
}

function addNewUser(req,res,next)
{
  const authorizationHeader = req.headers.authorization;
  const userToken = authorizationHeader.substring(7);
  createdBy = jwt_decode(userToken).userId;
  createdAt =  new Date(Date.now());
  if (!createdBy) res.json({"message":"please login"})
  // Add new user 
  // username 
  // password
  // ..
  const { username, password, confirmPassword, email, gender, name, age } =
  req.body;


  knexDb('users')
  .where('username', username)
  .then((rows) => {
    if (rows.length > 0) {
      return res.status(400).json({ error: 'Username already exists' });
    } else {
      const { hashedPassword, salt } = hashPassword(password);
      const userData = {
        username,
        hashedPassword,
        salt,
        email,
        gender,
        name,
        age,
        createdBy,
        createdAt,

      };

      knexDb('users')
        .insert(userData)
        .then(() => {
          return res
            .status(200)
            .json({ message: 'Registration successful', data: userData });
        })
        .catch((error) => {
          throw error;

        });
    }
  })
  .catch((error) => {
    throw error;
    
  });


}

module.exports = { register, login, forgotPassword, resetPassword,addNewUser };
