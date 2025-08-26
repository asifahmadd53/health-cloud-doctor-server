import mongoose from "mongoose";


const addDrugTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    dosageMode: {
        type: [String],
        required: true,
        trim: true,
        validate: {
            validator: function(v) {
                return v.length > 0; 
            },
            message: "At least one dosage mode is required"
        }
    },
    dosageStrength: {
        type: [String],
        required: true,
        trim: true,
        validate: {
            validator: function(v) {
                return v.length > 0; 
            },
            message: "At least one dosage strength is required"
        }
    },
    dosageUnits: {
        type: [String],
        required: true,
        trim: true,
        validate: {
            validator: function(v) {
                return v.length > 0; 
            },
            message: "At least one dosage unit is required"
        }
    },
})


const DrugSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    type:{
        type: [addDrugTypeSchema],
        required: true,
        trim: true,
        validate: {
            validator: function(v) {
                return v.length > 0; 
            },
            message: "At least one drug type is required"
        }
    }
})

const drugs = mongoose.model("Drugs", DrugSchema);
export default drugs;