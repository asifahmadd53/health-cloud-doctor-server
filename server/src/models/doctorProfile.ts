import mongoose, { Schema } from "mongoose";

const doctorProfileSchema = new Schema({
  doctor: {
    type: Schema.Types.ObjectId,
    ref: "DoctorAuth",
    required: true
  },
  specialty: {
    type: String,
    required: false,
    trim: true,
  },
  years: {
    type: String,
    required: false,
  },
  certifications: {
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
//   schedules: [
//     {
//       type: Schema.Types.ObjectId,
//       ref: "ClinicSchedule", 
//     }
//   ]
}, { timestamps: true });

const doctorProfile = mongoose.model("doctorProfile", doctorProfileSchema);
export default doctorProfile;
