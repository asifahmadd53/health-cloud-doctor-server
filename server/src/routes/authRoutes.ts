import { Router } from "express";
import { login, signUp } from "../controllers/authControllers";

const router = Router()

router.post('/signup',signUp)
router.post('/login',login)


export default router;
