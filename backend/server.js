const express = require('express');
const dotenv = require('dotenv');
const db = require('./config/db');
const router = require('./routes/productRoutes');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const authrouter = require('./routes/authRoutes');
const admin = require('./routes/adminRoutes');
const app = express();
dotenv.config();
const PORT = process.env.PORT || 3000;

//Middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
// Middleware for handling file uploads
app.use(fileUpload());
app.use('/uploads', express.static('uploads/images'));

//DB connection
db();

//Routes
app.use('/api', router);
app.use('/auth', authrouter);
app.use('/admin', admin);
app.listen(PORT,() =>{
     console.log(`server is running on port ${PORT}`);
});