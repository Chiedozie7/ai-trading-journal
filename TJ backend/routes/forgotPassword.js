const forgotPasswordController = require('../controllers/forgotPasswordController');
const express = require('express');
const router = express.Router();

router.post(
    "/",
    forgotPasswordController.handleForgotPassword
);

module.exports = router;