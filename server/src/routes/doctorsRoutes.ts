import { Router } from "express";
import { getApprovedDoctors, getDoctor, getDoctors, getPendingDoctors, updateDoctorStatus } from "../controllers/doctorsControllers";
import { createSchedule, getDoctorAvailableSlots, getSchedule, updateDoctorProfile } from "../controllers/doctorProfileController";
import { logout } from "../controllers/doctorAuthControllers";
import { authenticate } from "../middleware/authenticate";
import { Auth } from "firebase-admin/auth";


const router = Router()

router.get('/get-all-doctors',getDoctors)
router.get("/get-pending-doctors", getPendingDoctors)
router.get('/get-approved-doctors',getApprovedDoctors)
// router.patch("/update-doctor-gender/:id", updateDoctorGender);
router.get('/get-doctor/:id', getDoctor)
router.patch('/update-doctor',authenticate,updateDoctorProfile)
router.patch('/update-doctor-status/:id',updateDoctorStatus)
router.post('/create-schedule',authenticate,createSchedule)
router.get('/get-schedule',authenticate,getSchedule)
router.get("/get-available-slots",authenticate, getDoctorAvailableSlots);
router.post('/logout',logout)


export default router