import mongoose from "mongoose";

const doctorAuthSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  profileImage:{
      type:String,
      required:false
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
  // specialty: {
  //   type: String,
  //   required: false,
  //   trim: true,
  // },
  // years: {
  //   type: String,
  //   required: false,
  // },
  // certifications: {
  //   type: String,
  //   required: false,
  // },
  // professionalBio: {
  //   type: String,
  //   required: false,
  // },
  // clinicAddress: {
  //   type: String,
  //   required: false,
  // },
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

const doctorAuth =  mongoose.model("DoctorAuth", doctorAuthSchema);

export default doctorAuth