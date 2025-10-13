import { Router } from "express";
import { pateintSignUp, verifyOtp } from "../controllers/patientAuthController";

const router = Router();

router.post("/patient-signup", pateintSignUp);
router.post("/verify-otp", verifyOtp);

export default router;