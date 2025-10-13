import { Router } from "express";
import { patientAuth, verifyOtp } from "../controllers/patientAuthController";

const router = Router();

router.post("/patient-auth", patientAuth);
router.post("/verify-otp", verifyOtp);


export default router;