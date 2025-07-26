import { Router } from "express";
import { createAppointment, deleteAppointment, updateAppointment, getAppointments, getAppointmentById} from "../controllers/appointmentController";
import { authenticate } from "../middleware/authenticate";

const route = Router();

route.post("/create-appointment",authenticate, createAppointment)
route.get("/get-appointments", getAppointments)
route.get("/get-appointment/:id", getAppointmentById)
route.put("/update-appointment/:id", updateAppointment)
route.delete("/delete-appointment/:id", deleteAppointment)



export default route;
