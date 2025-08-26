import { Router } from "express";
import { addDrug, deleteDrug, getAllDrugs, updateDrug } from "../controllers/addDrugController";

const router = Router();

router.post("/add-drug", addDrug);
router.get("/get-all-drugs", getAllDrugs); 
router.patch('/update-drug/:id', updateDrug);
router.delete("/delete-drug/:id", deleteDrug);

export default router;