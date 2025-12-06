import { Router } from "express";
import { getDoctorById, getDoctorsByPatient } from "../controllers/patientController";
import { createPatientProfile, getPatientProfile, updatePatientProfile } from "../controllers/patientProfileController";
import { authenticate } from "../middleware/authenticate";
import { uploadPatientDocument } from "../controllers/patientDocumentsController";
import upload from "../config/multer-config";


const router = Router();

router.post('/create-patient-profile',authenticate, createPatientProfile);
router.get('/get-patient-profile',authenticate, getPatientProfile)
router.patch("/update-patient-profile", authenticate, updatePatientProfile);
router.get("/get-doctors-by-patient", getDoctorsByPatient);
router.get("/get-doctor-by-id/:id", getDoctorById);
router.post("/upload-patient-document",upload.single("document"), uploadPatientDocument);


export default router;