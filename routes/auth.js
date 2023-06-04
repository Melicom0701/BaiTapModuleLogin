const express = require("express");
const router = express.Router();
const {validatePUTRequest, validateRegisterRequest} = require("../middleware/userValidate")
const { hashPassword, comparePassword } = require("../helpers/hash");
const { register, login ,forgotPassword,resetPassword,addNewUser} = require("../middleware/authHandling");
// Login
router.post(
  "/register",
  [validateRegisterRequest],register);
router.post("/login",login);
router.post("/addNew",addNewUser)
router.post("/forgot-password",forgotPassword);
router.post('/reset-password/:passwordResetToken',resetPassword)
module.exports = router;
