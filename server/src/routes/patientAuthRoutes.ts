import { Router } from "express";
import { verifyOtp, patientAuth } from "../controllers/patientAuthController";

const router = Router();

router.post("/patient-auth", patientAuth);
router.post("/verify-otp", verifyOtp);


export default router;