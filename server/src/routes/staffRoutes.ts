import { Router } from "express";
import { addStaff, staffLogin, getStaff, updateStaff, deleteStaff, getStaffById } from "../controllers/staffController";
import { authenticate } from "../middleware/authenticate";

const router = Router();

router.post('/add-staff',authenticate, addStaff);
router.post('/login-staff', staffLogin);
router.get('/get-staff',authenticate, getStaff);
router.get('/get-staff/:id', getStaffById);
router.delete('/delete-staff/:id', deleteStaff);
router.put('/update-staff/:id', updateStaff);


export default router;
