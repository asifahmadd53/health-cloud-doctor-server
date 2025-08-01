import { Router } from "express";
import { getApprovedDoctors, getDoctor, getDoctors, getPendingDoctors, updateDoctorGender, updateDoctorStatus } from "../controllers/doctorsControllers";

const router = Router()

router.get('/get-all-doctors',getDoctors)
router.get("/get-pending-doctors", getPendingDoctors);
router.get('/get-approved-doctors',getApprovedDoctors)
router.patch("/update-doctor-gender/:id", updateDoctorGender);
router.get('/get-doctor/:id', getDoctor)
router.patch('/update-doctor-status/:id',updateDoctorStatus)


export default router