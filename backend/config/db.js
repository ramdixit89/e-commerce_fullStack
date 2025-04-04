const mongoose = require('mongoose');

const db = async() =>{
    const conn = await mongoose.connect(process.env.MONGO_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
}
module.exports = db;