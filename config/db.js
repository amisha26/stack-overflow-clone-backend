const mongoose = require('mongoose');
require('dotenv').config();

const connectDb = async() => {
    try {
        const MONGO_URI = process.env.MONGO_URI;

        await mongoose.connect(MONGO_URI);

        console.log("Mongodb connected successfully");
    }
    catch (error) {
        console.error('❌ MongoDB Connection Failed:', error.message);
        process.exit(1);
    }
}

module.exports = connectDb;