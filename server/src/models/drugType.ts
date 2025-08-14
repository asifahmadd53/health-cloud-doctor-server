import mongoose from "mongoose";

const drugTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  dosageUnits: {
    type: [String],
    required: true,
    trim: true,
    validate:{
        validator: function(v) {
            return v.length > 0; 
        },
        message: "At least one dosage unit is required"
    }
  },
  dosageMode: {
    type: [String],
    required: true,
    trim: true,
    validate:{
        validator: function(v) {
            return v.length > 0; 
        },
        message: "At least one dosage mode is required"
    }
  },
});

export default mongoose.model("DrugType", drugTypeSchema);
