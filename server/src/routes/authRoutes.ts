import { Router } from "express";
import { 
  login, 
  resetPassword, 
  sendVerificationEmail, 
  signUp, 
  verifyEmail 
} from "../controllers/doctorAuthControllers";

const router = Router();

router.post('/signup', signUp);
router.post('/login', login);
router.patch('/send-verification-code', sendVerificationEmail);
router.patch('/verify-verification-code', verifyEmail);
router.put('/reset-password', resetPassword);

export default router;