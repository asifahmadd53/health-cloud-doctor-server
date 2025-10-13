import { Router } from "express";
import { getDoctorsByPatient } from "../controllers/patientController";


const router = Router();

router.get("/get-doctors-by-patient", getDoctorsByPatient);

export default router;