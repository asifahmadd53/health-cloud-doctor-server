import { Router } from "express";
import { createAppointment } from "../controllers/appointmentController";
import { authenticate } from "../middleware/authenticate";

const route = Router();

route.post("/create-appointment",authenticate, createAppointment);

export default route;
