const express = require("express");
const router = express.Router();
const db = require("../database/connection");
const jwt = require("jsonwebtoken");

const { hashPassword, comparePassword } = require("../helpers/hash");

function validateRegisterRequest(req, res, next) {
  if (req.body.username && req.body.password) {
    return next();
  }

  return res.status(400).json({ message: "Error validating" });
}

// Login
router.post(
  "/register",
  [validateRegisterRequest],
  async function (req, res, next) {
    // Get info from request body
    const { username, password, confirmPassword, email, gender, name, age } =
      req.body;
    // Validate inputs
    if (username.length < 3) {
      return res
        .status(400)
        .json({ error: "Username must be at least 3 characters long" });
    }
    if (password.length < 3) {
      return res
        .status(400)
        .json({ error: "Password must be at least 3 characters long" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Email is not valid" });
    }
    if (name.length < 2) {
      return res
        .status(400)
        .json({ error: "Name must be at least 2 characters long" });
    }
    if (typeof age !== "number" && age < 0) {
      return res.status(400).json({ error: "Age must be a positive number" });
    }
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
                return res
                  .status(500)
                  .json({ error: "Internal server error " });
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
);

router.post("/login", function (req, res, next) {
  // Get username, password from request body
  const { username, password } = req.body;
  // Check if user exists
  let sql = "SELECT * FROM users WHERE username = ?";
  db.query(sql, [username], function (err, results) {
    if (err) {
      throw err;
    }
    // If no: response with an error
    if (results.length==0) {
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
});

module.exports = router;
