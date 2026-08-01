const express = require('express');
const router = express.Router();
const { handleChangePassword } = require("../controllers/changePasswordController");


router.patch("/", handleChangePassword);

module.exports = router;