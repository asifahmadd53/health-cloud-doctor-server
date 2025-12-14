import mongoose from "mongoose";

const patientDocumentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PatientProfile",
      required: true,
    },
    documents: [
      {
        documentType: {
          type: String,
          enum: ["REPORT", "PRESCRIPTION", "UNKNOWN"],
          default: "UNKNOWN",
          required: true,
        },
        documentUrl: {
          type: String,
          required: true,
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true, // ← createdAt / updatedAt on the parent record
  }
);

export default mongoose.model("PatientDocument", patientDocumentSchema);
