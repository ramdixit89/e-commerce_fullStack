const Admin = require('../models/adminModel');
//Create admin
const createAdmin = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            res.status(400).json({
                status: 'failed',
                message: 'All fields are reuquired!'
            });
        }
        const admin = new Admin({
            username,
            email,
            password
        });
        if (admin) {
            await admin.save();
            res.status(201).json({
                status: 'success',
                message: 'Admin created successfully',
                data: admin
            });
        }
    } catch (error) {
        console.log("Error", error);
        res.status(500).json({
            status: 'failed',
            message: 'Internal server error'
        });
    }
}

//Admin login
const adminLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            res.status(400).json({
                status: 'failed',
                message: 'All fields are reuquired!'
            });
        }
        const admin = await Admin.findOne({ username });
        res.status(200).json({
            status: 'success',
            message: 'Admin login successfully',
        });
    } catch (error) {
        console.log("Error", error);
        res.status(500).json({
            status: 'failed',
            message: 'Internal server error'
        });
    }
}
module.exports = {
    createAdmin, adminLogin
}