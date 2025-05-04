import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoURL = 'mongodb://localhost:27017/healthcloudDB';


mongoose.connect(mongoURL);


const db = mongoose.connection;

db.on('connected', () => {
    console.log('Connected to database');
});

db.on('error', console.error.bind(console, 'Connection error:'));

db.on('disconnected', () => {
    console.error('Disconnected from database');
});

console.log('Hello World')

export default db;
