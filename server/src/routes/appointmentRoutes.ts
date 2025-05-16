import { Router } from "express";
import { createAppointment, getAppointments } from "../controllers/appointmentController";
import { authenticate } from "../middleware/authenticate";

const route = Router();

route.post("/create-appointment",authenticate, createAppointment);
route.get("/get-appointments", getAppointments);


export default route;
