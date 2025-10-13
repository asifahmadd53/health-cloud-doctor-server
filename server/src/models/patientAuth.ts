import mongoose from "mongoose";

const patientAuthSchema = new mongoose.Schema(
  {
    patientNumber: {
      type: String,
      required: true,
      unique: true,
    },
    otp: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: "1h",
    },
  },
  { timestamps: true } 
);

export const PatientAuth = mongoose.model("PatientAuth", patientAuthSchema);
