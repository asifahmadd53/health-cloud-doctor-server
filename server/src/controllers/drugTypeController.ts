import drugType from "../models/drugType";

export const addDrugType = async (req:any, res:any) => {
    try {
        const { name, dosageUnits, dosageMode } = req.body;

        
        const existingDrugType = await drugType.findOne({ name });
        if (existingDrugType) {
            return res.status(400).json({ 
                success: false,
                msg: "Drug Type already exists" });
        }

        
        const newDrugType = await drugType.create({ name, dosageUnits, dosageMode });
        return res.status(201).json({
            success: true,
            message: "Drug Type created successfully",
            newDrugType });
    } catch (err) {
        return res.status(500).json({ msg: "Error while creating the Drug Type" });
    }
}


export const getDrugTypes = async (req:any, res:any) => {
    try {
        const drugTypes = await drugType.find();
        if (drugTypes.length === 0) {
            return res.status(404).json({ msg: "No Drug Types found" });
        }
        return res.status(200).json({ msg: "Drug Types fetched successfully", drugTypes });
    } catch (err) {
        return res.status(500).json({ msg: "Error while fetching Drug Types" });
    }
}

export const deleteDrugType = async (req:any, res:any) => {
    try {
        const { id } = req.params;
        const drugTypeToDelete = await drugType.findByIdAndDelete(id);

        if (!drugTypeToDelete) {
            return res.status(404).json({
                success: false,
                message: "Drug Type not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Drug Type deleted successfully",
        });
    } catch (error:any) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}