const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const authrouter = express.Router();

authrouter.post('/register', registerUser);
authrouter.post('/login', loginUser);
module.exports = authrouter;