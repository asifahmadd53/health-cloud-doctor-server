import mongoose from "mongoose";

const medicationSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  type: { type: String, required: true, trim: true },
  mode: { type: String, required: true, trim: true },
  strength: { type: String, required: true, trim: true },
  dosage: { type: String, required: true, trim: true }, 
  duration: { type: Number, required: true, min: 1 },
  mealTiming: {
    type: String,
    enum: ["OD", "BD", "TDS", "QID", "HS", "MORNING"],
    required: true,
  },
  beforeAfter: {
    type: String,
    enum: ["Before Meal", "After Meal"],
    required: true,
  },
});

const prescriptionSchema = new mongoose.Schema(
  {
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
      index: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PatientProfile",
      required: true,
      index: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "doctorProfile",
      required: true,
      index: true,
    },

    complaints: { type: String, trim: true },
    hopi: { type: String, trim: true },
    pastHistory: {
      dm: { type: Boolean, default: false },
      htn: { type: Boolean, default: false },
      hepb: { type: Boolean, default: false },
      hepc: { type: Boolean, default: false },
      ihd: { type: Boolean, default: false },
      smoker: { type: Boolean, default: false },
    },
    diagnosis: { type: String, trim: true },
    labs: { type: String, trim: true },
    radiology: { type: String, trim: true },

    medications: {
      type: [medicationSchema],
      validate: [
        (val: any) => val.length > 0,
        "At least one medication is required",
      ],
    },

    specialInstructions: { type: String, trim: true },

    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Prescription = mongoose.model("Prescription", prescriptionSchema);
export default Prescription;
