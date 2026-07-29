const loginController = require('../controllers/loginController');
const express = require('express');
const router = express.Router();

router.post('/', loginController.handleLogin);

module.exports = router;