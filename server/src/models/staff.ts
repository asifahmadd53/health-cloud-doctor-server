import mongoose from "mongoose";

const staffSchema = new mongoose.Schema({
  doctor:{
    type : mongoose.Schema.Types.ObjectId,
    ref:"doctorAuth",
    required:true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    default:null,
    trim: true,
  },
  bio: {
    type: String,
    default:null,
    trim: true,
  },
  profileImage: {
    type: String,
    default:null,
  },

});

export default mongoose.model("Staff", staffSchema);