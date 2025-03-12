const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//generate token
const generateToken = (userId, email) =>{
   return jwt.sign({userId, email}, process.env.SECRET_KEY, {expiresIn: "7d"});
}
//register
const registerUser = async(req, res) =>{
  try {
    const { username, email, password } = req.body;
    if(!username || !email || !password){
      return res.status(400).json({message:"All fields are required"});
    }
    const existUser = await User.findOne({ username });
    if(existUser){
      return res.status(400).json({message:"User already exists!"});
    }
    const hashedPassword = await bcrypt.hash(password, 8);
    const token = generateToken(email);
    const newUser = new User({
        username,
        email,
        password : hashedPassword,
        token,
    });
    await newUser.save();
    res.status(201).json({message:"User registered successfully!"});
  } catch (error) {
    console.log(error);
    res.status(400).json({message:"Error while registering user!"});
  }
} 

//login user
const loginUser = async(req, res) =>{
    try {
        const { username, password } = req.body;
        if(!username || !password){
            return res.status(400).json({message:"All fields are required"});
        }
        const user = await User.findOne({ username });
        if(!user){
            return res.status(404).json({message:"User not found!"});
        }
        res.status(200).json({
          message: "Login successful",
          token: user.token,
          userId: user._id,
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({message:"Error while logging in user!"});
    }
}

const getAllUsers = async(req, res) =>{
  try {
    const users = await User.find();
    res.status(200).json({
      status : 'success!',
      message: 'All registered users!',
      data : users
    })
  } catch (error) {
    console.log('Errors : ', error);
    res.status(400).json({
      status: 'failed!',  
      message: 'Internal server error!'
    });
  }
}
module.exports = { registerUser, loginUser, getAllUsers };