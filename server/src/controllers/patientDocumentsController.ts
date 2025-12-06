import { Request, Response } from "express";
import imagekit from "../services/imageKitServices";
import patientDocuments from "../models/patientDocuments";


export const uploadPatientDocument = async (req: any, res: any) => {
  try {
    const patientId = req.user.id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const base64File = req.file.buffer.toString("base64");

    const uploadResult = await imagekit.upload({
      file: base64File,
      fileName: `patient-doc-${Date.now()}`,
    });

    let patientDocs = await patientDocuments.findOne({ patient: patientId });

    const newDocument = {
      documentType: req.body.documentType || "Unknown",
      documentUrl: uploadResult.url,
    };

    if (patientDocs) {
      // Add new document to existing documents array
      patientDocs.documents.push(newDocument);
      await patientDocs.save();
    } else {
      // Create new document entry
      patientDocs = await patientDocuments.create({
        patient: patientId,
        documents: [newDocument],
      });
    }

    return res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      data: patientDocs,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};
