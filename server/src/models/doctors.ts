import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  // Sign Up Fields

  name: {
    type: String,
    required: true,
    trim: true,
  },
  pmdcNumber: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  pmdcCopy: {
    type: String,
    required: true,
  },
  // 🔄 Profile setup fields (optional at signup)
  specialty: {
    type: String,
    required: false,
    trim: true,
  },
  years: {
    type: Number,
    required: false,
  },
  certification: {
    type: String,
    required: false,
  },
  professionalBio: {
    type: String,
    required: false,
  },
  clinicAddress: {
    type: String,
    required: false,
  },
  // ✅ Extra meta
  isApproved: {
    type: Boolean,
    default: false,
  },
  gender:{
    type: Boolean,
    required:false
  },
  verificationCode: {
    type: String,
    default: null,
  },
  verificationCodeExpires: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Doctor", doctorSchema);
