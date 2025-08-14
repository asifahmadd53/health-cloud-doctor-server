import drugMode from "../models/drugMode"

export const addDrugMode = async (req:any, res:any)=>{
    try{
        const {name}  = req.body
        const findDrugMode = await drugMode.findOne({name})
        if(findDrugMode){
            return res.status(400).json({msg: "Drug Mode already exists"})
        }
        const newDrugMode = await drugMode.create({name})
        if(newDrugMode){
            return res.status(201).json({msg: "Drug Mode created successfully", newDrugMode})
        }
    }catch(err){
        return res.status(500).json({msg: "Error while creating the Drug Mode"})
    }
}

export const getDrugModes = async (req:any, res:any)=>{
    try{
        const drugModes = await drugMode.find()
        if(drugModes.length === 0){
            return res.status(404).json({msg: "No Drug Modes found"})
        }
        return res.status(200).json({msg: "Drug Modes fetched successfully", drugModes})
    }catch(err){
        return res.status(500).json({msg: "Error while fetching Drug Modes"})
    }
}

export const deleteDrugMode = async (req:any, res:any) => {
    try {
        const { id } = req.params
        const drugModeToDelete = await drugMode.findByIdAndDelete(id)

        if (!drugModeToDelete) {
            return res.status(404).json({
                success: false,
                message: "Drug Mode not found",
            })
        }

        return res.status(200).json({
            success: true,
            message: "Drug Mode deleted successfully",
        })
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        })
    }
}