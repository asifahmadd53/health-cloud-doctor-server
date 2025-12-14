import { Request, Response } from "express";
import imagekit from "../services/imageKitServices";
import patientDocuments from "../models/patientDocuments";

export const uploadPatientDocument = async (req: any, res: any) => {
  try {
    const patientId = (req as any).user.id;

    if (!req.file) {
      return res
        .status(400)
        .json({
          success: false,
          message: "No file uploaded or invalid file type",
        });
    }

    const base64 = req.file.buffer.toString("base64");

    const uploadResult = await imagekit.upload({
      file: base64,
      fileName: `doc-${Date.now()}`,
      folder: `/patients/${patientId}`,
    });

    const newDoc = {
      documentType: req.body.documentType || "UNKNOWN",
      documentUrl: uploadResult.url,
    };

    let patientDocs = await patientDocuments.findOne({ patient: patientId });

    if (patientDocs) {
      patientDocs.documents.push(newDoc);
      await patientDocs.save();
    } else {
      patientDocs = await patientDocuments.create({
        patient: patientId,
        documents: [newDoc],
      });
    }

    res.status(201).json({
      success: true,
      message: "Document uploaded",
      data: newDoc,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
