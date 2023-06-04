
function validateRegisterRequest(req, res, next) {
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

  return next();
}

function validatePUTRequest(req, res, next) {
  const { name, age, gender } = req.body;
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
  return next();
}




module.exports = { validatePUTRequest, validateRegisterRequest };


