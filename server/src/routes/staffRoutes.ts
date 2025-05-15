import { Router } from "express";
import { addStaff, staffLogin, getStaff, updateStaff, deleteStaff, getStaffById } from "../controllers/staffController";

const router = Router();

router.post('/add-staff', addStaff);
router.post('/login-staff', staffLogin);
router.get('/get-staff', getStaff);
router.get('/get-staff/:id', getStaffById);
router.delete('/delete-staff/:id', deleteStaff);
router.put('/update-staff/:id', updateStaff);


export default router;
