import {Router} from 'express'
import { addDrugMode, deleteDrugMode, getDrugModes } from '../controllers/drugModeController'

const router = Router()

router.post("/add-drug-mode", addDrugMode)
router.get("/get-all-drug-modes", getDrugModes)
router.delete("/delete-drug-mode/:id", deleteDrugMode)


export default router