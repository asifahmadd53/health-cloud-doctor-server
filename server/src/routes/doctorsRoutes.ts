import { Router } from "express";
import { getDoctor, getDoctors } from "../controllers/doctorsControllers";

const router = Router()

router.get('/get-all-doctors',getDoctors)
router.get('/get-doctor/:id', getDoctor)


export default router