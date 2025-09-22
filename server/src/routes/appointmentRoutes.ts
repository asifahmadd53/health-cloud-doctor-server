import { Router } from "express";
import { createAppointment, deleteAppointment, updateAppointment, getAppointments, getAppointmentById, getDoctorAppointments, getDoctorAppointmentById, } from "../controllers/appointmentController";
import { authenticate } from "../middleware/authenticate";
import { getDoctor } from "../controllers/doctorsControllers";

const route = Router();

route.post("/create-appointment",authenticate, createAppointment)
route.get("/get-appointments",authenticate, getAppointments)
route.get("/get-appointment/:id", getAppointmentById)
route.put("/update-appointment/:id", updateAppointment)
route.delete("/delete-appointment/:id", deleteAppointment)
route.get('/get-doctor-appointments',authenticate, getDoctorAppointments)
route.get('/get-doctor-appointment/:id',authenticate, getDoctorAppointmentById)


export default route;
