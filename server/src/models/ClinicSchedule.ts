import mongoose from "mongoose";

const clinicScheduleSchema = new mongoose.Schema({
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "doctorProfile",
        required: true
    },
    weeklySchedule: [
        {
            day: {
                type: String,
                enum: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
                required: true
            },
            isWorking: { type: Boolean, default: true },
            startTime: { type: String, match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ },
            endTime: { type: String, match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ },
            hasBreak: { type: Boolean, default: false },
            breakStart: { type: String, match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ },
            breakEnd: { type: String, match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ },
            patientPerHour: { type: Number, min: 1, max: 20 },
        }
    ]
}, { timestamps: true });

const ClinicSchedule = mongoose.model("ClinicSchedule", clinicScheduleSchema);
export default ClinicSchedule;
