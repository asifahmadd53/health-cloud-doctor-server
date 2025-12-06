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
import drugTypesRoutes from './routes/drugTypeRoutes'
import drugRoutes from './routes/drugRoutes'
import helmet from "helmet";
import patientAuthRoutes from "./routes/patientAuthRoutes";
import patientRoutes from "./routes/patientRoutes";
import prescriptionRoutes from "./routes/prescriptionRoutes";

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
app.use('/api/drugtype', drugTypesRoutes)
app.use('/api/drugs', drugRoutes)
app.use("/api/auth", patientAuthRoutes)
app.use('/api/patients', patientRoutes)
app.use('/api/prescriptions', prescriptionRoutes)


app.get("/", (req, res) => {
    res.send("Hello Worlddddddddd")
})


connectDB().then(()=>{
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${`http://localhost:${process.env.PORT}`}`)
    })
})