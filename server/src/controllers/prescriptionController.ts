import Appointment from "../models/appointment";
import patientProfile from "../models/patientProfile";
import Prescription from "../models/prescription";

export const createPrescription = async (req: any, res: any) => {
  try {
    const doctorId = req.user?.id; 

    const {
      appointment,
      patient,
      complaints,
      hopi,
      pastHistory,
      diagnosis,
      labs,
      radiology,
      medications,
      specialInstructions,
    } = req.body;


    if (!appointment || !patient || !medications || medications.length === 0) {
      return res.status(400).json({
        message:
          "Appointment, patient, and at least one medication are required",
      });
    }

    // Check if appointment exists
    const foundAppointment = await Appointment.findById(appointment);
    if (!foundAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Check if patient exists
    const foundPatient = await patientProfile.findById(patient);
    if (!foundPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Create Prescription
    const prescription = await Prescription.create({
      appointment,
      patient,
      doctor: doctorId,
      complaints,
      hopi,
      pastHistory,
      diagnosis,
      labs,
      radiology,
      medications,
      specialInstructions,
    });

    return res.status(201).json({
      message: "Prescription created successfully",
      prescription,
    });
  } catch (error:any) {
    console.error("Create Prescription Error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
