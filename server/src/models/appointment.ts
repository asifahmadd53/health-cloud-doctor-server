import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staff",
    required: false,
    default: undefined,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "doctorProfile",
    required: true,
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PatientAuth",
    required: false,
    default: undefined,
  },
  patientName: {
    type: String,
    required: false,
  },
  patientCNIC: {
    type: String,
    required: false,
  },
  patientPhone: {
    type: String,
    required: true,
  },
  patientAge: {
    type: Number,
    required: false,
  },
  gender: {
    type: String,
    required: false,
  },
  day: {
    type: String,
    enum: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    required: false,
  },
  slotTime: {
    type: String,
    required: false,
  },
  clinicScheduleSlotId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
  },
  date: {
    type: Date,
    default: null,
  },
  time: {
    type: String,
    default: null,
  },
  paymentStatus: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;

