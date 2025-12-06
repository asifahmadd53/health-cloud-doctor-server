import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { createPrescription } from "../controllers/prescriptionController";


const router = Router()

router.post("/create-prescription", authenticate, createPrescription);


export default router;