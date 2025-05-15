import { appointmentSchema } from "../middleware/validator";
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
  
      // Validate input
      const { error } = appointmentSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          message: "Invalid data",
          error: error.details[0].message
        });
      }
  
      // Get logged-in staff ID from auth middleware
      const staffId = req.user.id;
  
      // Create the appointment with staffId
      const appointment = await Appointment.create({
        patientName,
        patientCNIC,
        patientPhone,
        patientAge,
        gender,
        date,
        time,
        paymentStatus,
        staffId, // Associate appointment with staff
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
  
