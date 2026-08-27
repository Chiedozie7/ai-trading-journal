const express = require("express");

const router = express.Router();

const {
    handleVerifyEmail
} = require("../controllers/verifyEmailController");

router.get("/", handleVerifyEmail);

module.exports = router;