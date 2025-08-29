import { Router } from "express";
import { getApprovedDoctors, getDoctor, getDoctors, getPendingDoctors, updateDoctorStatus } from "../controllers/doctorsControllers";
import { createSchedule, getSchedule, updateDoctorProfile } from "../controllers/profileController";


const router = Router()

router.get('/get-all-doctors',getDoctors)
router.get("/get-pending-doctors", getPendingDoctors);
router.get('/get-approved-doctors',getApprovedDoctors)
// router.patch("/update-doctor-gender/:id", updateDoctorGender);
router.get('/get-doctor/:id', getDoctor)
router.patch('/update-doctor/:id',updateDoctorProfile)
router.patch('/update-doctor-status/:id',updateDoctorStatus)
router.post('/create-schedule',createSchedule)
router.get('/get-schedule/:doctorId',getSchedule)


export default router