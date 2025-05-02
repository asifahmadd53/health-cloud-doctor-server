import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  pmdcNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  pmdcCopy: {
    type: String, // base64-encoded image or URL
    required: false, // set to true if you want it mandatory
  },
  approved:{
    type:String,
    default:false,
  },
  termsAccepted: {
    type: Boolean,
    default: false, // Default to false, must be checked by the user
  },
});

export default mongoose.model("Doctor", doctorSchema);
