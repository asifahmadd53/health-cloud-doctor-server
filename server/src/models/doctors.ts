import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  name:{
     type:String,
     required:true,
     trim:true,
  },
  pmdcNumber:{
    type:String,
    required:true,
    trim:true,
  },
  email:{
    type:String,
    required:true,
    unique:true,
    trim:true,
  },
  phoneNumber:{
    type:String,
    required:true,
    trim:true,
  },
  password:{
    type:String,
    required:true,
  },
  pmdcCopy:{
    type:String,
    required:false,
  },
  approved:{
    type:Boolean,
    default:false,
  }
  
})

export default mongoose.model("Doctor", doctorSchema);
