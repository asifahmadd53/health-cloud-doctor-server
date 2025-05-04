import express from "express";
import dotenv from "dotenv";
dotenv.config();
// import db from "./database/db";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const app =  express()

app.use(cors({credentials: true,}))

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(bodyParser.json())

app.use('/api/auth', authRoutes);




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









app.get("/", (req, res) => {
    res.send("Hello Worlddddddddd")
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${`http://localhost:${process.env.PORT}`}`)
})

