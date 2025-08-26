import { Router } from "express";
import { addDrugType, deleteDrugType, getDrugTypes } from "../controllers/drugTypeController";

const router = Router();

router.post("/add-drug-type", addDrugType);
router.get("/get-all-drug-types", getDrugTypes)
router.delete("/delete-drug-type/:id", deleteDrugType)

export default router;