// the dosage units and  mode must be more than one?

import drugType from "../models/drugType";

export const addDrugType = async (req:any, res:any) => {
    try {
        const { name, dosageUnits, dosageMode } = req.body;

        // Check if drug type already exists
        const existingDrugType = await drugType.findOne({ name });
        if (existingDrugType) {
            return res.status(400).json({ msg: "Drug Type already exists" });
        }

        // Create new drug type
        const newDrugType = await drugType.create({ name, dosageUnits, dosageMode });
        return res.status(201).json({ msg: "Drug Type created successfully", newDrugType });
    } catch (err) {
        return res.status(500).json({ msg: "Error while creating the Drug Type" });
    }
}