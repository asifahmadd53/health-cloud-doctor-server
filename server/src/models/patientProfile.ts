import mongoose from "mongoose";
const patientProfileSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PatientAuth",
    required: true,
    unique: true,
    },
    name:{
        type: String,
        required: true,
        trim: true,
    },
    email:{
        type: String,
        trim: true,
        lowercase: true,
    },
    age:{
        type: Number,
        required: true
    },
    gender:{
        type: String,
        enum: ["Male", "Female", "Other"],
    },
    martialStatus:{
        type: String,
        enum: ["Single", "Married"],
    },
    disease:{
        type: [String],
        trim: true,
    }
})

export default mongoose.model("PatientProfile", patientProfileSchema);