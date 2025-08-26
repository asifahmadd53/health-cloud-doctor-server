import drugs from "../models/addDrugs";

export const addDrug = async (req:any, res:any) => {
    try{
       const {name, type } = req.body;
       const existingDrug = await drugs.findOne({ name });
       if(existingDrug){
           return res.status(400).json({ msg: "Drug already exists" });
       }
       if(!name || !type || type.length === 0){
           return res.status(400).json({ msg: "Name and type are required" });
       }
       const newDrug = await drugs.create({ name, type });
       return res.status(201).json({ msg: "Drug created successfully", newDrug });
    }catch(err:any){
       return res.status(500).json({
      success: false,
      message: "Server error while adding drug",
      error: err.message
    });
}
}

export const getAllDrugs = async (req:any, res:any) => {
    try {
        const drugsList = await drugs.find();
        if (drugsList.length === 0) {
            return res.status(404).json({ msg: "No drugs found" });
        }
        return res.status(200).json({ msg: "Drugs fetched successfully", drugsList });
    } catch (err:any) {
        return res.status(500).json({ msg: "Error while fetching drugs", error: err.message });
    }
}

export const updateDrug = async (req:any, res:any) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updatedDrug = await drugs.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!updatedDrug) {
            return res.status(404).json({
                success: false,
                message: "Drug not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Drug updated successfully",
            updatedDrug,
        });
    } catch (error:any) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}

export const deleteDrug = async (req:any, res:any) => {
    try {
        const { id } = req.params;
        const drugToDelete = await drugs.findByIdAndDelete(id);

        if (!drugToDelete) {
            return res.status(404).json({
                success: false,
                message: "Drug not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Drug deleted successfully",
        });
    } catch (error:any) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}