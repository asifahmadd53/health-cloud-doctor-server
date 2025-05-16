// import { appointmentSchema } from "../middleware/validator";
import Appointment from "../models/appointment";

export const createAppointment = async (req: any, res: any) => {
    try {
      const {
        patientName,
        patientCNIC,
        patientPhone,
        patientAge,
        gender,
        date,
        time,
        paymentStatus
      } = req.body;
      
     
  
      // Get logged-in staff ID from auth middleware
      const staffId = req.user.staffId;
  
      // Create the appointment with staffId
      const appointment = await Appointment.create({
        staffId,
        patientName,
        patientCNIC,
        patientPhone,
        patientAge,
        gender,
        date,
        time,
        paymentStatus,
      });
  
      return res.status(201).json({
        success: true,
        message: "Appointment created successfully",
        appointment,
      });
  
    } catch (error: any) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  };


export const getAppointments = async (req: any, res: any) => {
  try {
    const appointments = await Appointment.find();
    res.status(200).json({
      success: true,
      message: "Appointments fetched successfully",
      appointments,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};