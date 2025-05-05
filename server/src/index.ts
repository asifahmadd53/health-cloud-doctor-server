import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./database/db";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import bodyParser from "body-parser";

const app =  express()

app.use(cors({credentials: true,}))

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use('/api/auth', authRoutes);


app.get("/", (req, res) => {
    res.send("Hello Worlddddddddd")
})


connectDB().then(()=>{
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${`http://localhost:${process.env.PORT}`}`)
    })
})


