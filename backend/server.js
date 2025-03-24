const express = require('express');
const dotenv = require('dotenv');
const db = require('./config/db');
const router = require('./routes/productRoutes');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const path = require('path');
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
// app.use(fileUpload());
app.use(fileUpload({
     useTempFiles: true, // ✅ Enable temporary file storage
     tempFileDir: "/tmp/", // ✅ Define a temp directory
 }));
// app.use('/uploads', express.static('uploads/images'));
// Serve static files from 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//DB connection
db();

//Routes
app.use('/api', router);
app.use('/auth', authrouter);
app.use('/admin', admin);
app.listen(PORT,() =>{
     console.log(`server is running on port ${PORT}`);
});