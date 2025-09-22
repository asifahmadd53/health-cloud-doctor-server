import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    staffId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Staff",
       required: false,
       default: undefined
    },
    doctor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'doctorAuth',
        required:true,
    },
    patientName: {
        type: String,
        required: true
    },
    patientCNIC: {
        type: String,
        required: true
    },
    patientPhone: {
        type: String,
        required: true
    },
    patientAge: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default:null,
    },
    time: {
        type: String,
        default:null
    },
    paymentStatus: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;

