import mongoose from "mongoose";

const patientProfileSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PatientAuth",
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
  },
  maritalStatus: {
    type: String,
  },
  dob: {
    type: Date,
  },
  location: {
    type: String,
    trim: true,
  },
  disease: {
    type: [String],
    trim: true,
  },
});

export default mongoose.model("PatientProfile", patientProfileSchema);
