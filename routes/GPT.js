const express = require("express");
const router = express.Router();
const GPTHandling = require('../middleware/GPTHandling')
router.post("/index",GPTHandling);





router.export = router;
