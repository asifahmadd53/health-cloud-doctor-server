import mongoose from "mongoose";

const patientDocumentsSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PatientProfile",
    required: true,
    unique: true,
  },
  documents: [
    {
      documentType: {
        type: String,
        required: true,
      },
      documentUrl: {
        type: String,
        required: true,
      },
    },
  ],
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("PatientDocuments", patientDocumentsSchema);