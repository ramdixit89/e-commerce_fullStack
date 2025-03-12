const express = require('express');
const { createAdmin, adminLogin } = require('../controllers/adminController');
const { getAllUsers } = require('../controllers/authController');
const admin = express.Router();

admin.post('/create', createAdmin);
admin.post('/login_admin', adminLogin);
admin.get('/users', getAllUsers); //get all users
module.exports = admin;