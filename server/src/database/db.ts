import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoURL = 'mongodb://localhost:27017/healthcloudDB';

const connectDB = async () => {
    try {
        await mongoose.connect(mongoURL);
        console.log('Connected to database');
    } catch (err) {
        console.error('Connection error:', err);
    }

    mongoose.connection.on('disconnected', () => {
        console.error('Disconnected from database');
    });
};



export default connectDB;
