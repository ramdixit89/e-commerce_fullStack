const express = require('express');
const { createAdmin, adminLogin } = require('../controllers/adminController');
const { getAllUsers } = require('../controllers/authController');
const admin = express.Router();

const verifyToken = require('../middleware/authMiddleware');

admin.post('/create', createAdmin);
admin.post('/login_admin', adminLogin);
admin.get('/users', verifyToken, getAllUsers); //get all users
module.exports = admin;