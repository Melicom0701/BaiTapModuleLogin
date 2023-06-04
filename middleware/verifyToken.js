const jwt = require("jsonwebtoken");
require("dotenv").config();
const SECRET = process.env.JWT_SECRET;
//verfiy token
function verifyToken(req, res, next) {
  const user_id = req.params.id;
  const authorizationHeader = req.headers.authorization;
  const userToken = authorizationHeader.substring(7);
  try {
    const isTokenValid = jwt.verify(userToken, SECRET);

    // Authorization success
    if (isTokenValid.userId == user_id) next();
    // Authorization failed
    else
      return res.status(401).json({
        message: "unauthorized",
      });
  } catch (error) {
    return res.status(401).json({
      message: error.message,
    });
  }
}
module.exports = {verifyToken}