const mongoose = require('mongoose');

const db = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.log("Current Mongo URL:", process.env.MONGO_URL);
        console.error("MongoDB connection error details:", error);
        process.exit(1);
    }
}
module.exports = db;