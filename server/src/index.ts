import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import bodyParser from "body-parser";
import connectDB from "./database/db";
import staffRoutes from "./routes/staffRoutes";
import appointmentRoutes from "./routes/appointmentRoutes";
import doctorsRoutes from './routes/doctorsRoutes'
import adddrugModeRoutes from './routes/drugModeRoutes'
import helmet from "helmet";



const app =  express()

app.use(cors({credentials: true}))

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(helmet());


app.use('/api/auth', authRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/appointment', appointmentRoutes);
app.use('/api/doctors', doctorsRoutes)
app.use('/api/drugmode', adddrugModeRoutes)


app.get("/", (req, res) => {
    res.send("Hello Worlddddddddd")
})

connectDB().then(()=>{
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${`http://localhost:${process.env.PORT}`}`)
    })
})