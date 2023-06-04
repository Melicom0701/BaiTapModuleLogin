const express = require("express");
const router = express.Router();
const {validatePUTRequest, validateRegisterRequest} = require("../middleware/userValidate")
const {verifyToken} = require("../middleware/verifyToken");
const {updateUserInfo,updateUserInfoUsingKnex,deleteUser,searchUsers} = require("../middleware/usersHandling");
const mailSendingHandler = require("../middleware/mailSendingHandler");
const db = require("../database/connection"); 
// UPDATE USER INFO
//router.put("/:id", validatePUTRequest,verifyToken,updateUserInfo);
router.get("/search",searchUsers)
router.put("/:id",validatePUTRequest,verifyToken,updateUserInfoUsingKnex);
router.delete("/:id",verifyToken,deleteUser)
router.post("/mailSending",mailSendingHandler)

module.exports = router;
