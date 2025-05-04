import { Router } from "express";
import { signUp } from "../controllers/authControllers";

const router = Router()

router.post('/signup',signUp)
// router.post('/login',login)

export default router;
