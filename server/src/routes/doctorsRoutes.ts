import { Router } from "express";
import { getDoctors } from "../controllers/doctorsControllers";

const router = Router()

router.get('/get-all-doctors',getDoctors)

export default router