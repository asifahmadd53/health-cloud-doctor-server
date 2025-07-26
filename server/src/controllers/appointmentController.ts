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


export const getAppointments = async(req:any, res:any)=>{
  try{
    const appointments = await Appointment.find().populate('staffId')
    res.status(200).json({
      success: true,
      message: "Appointments fetched successfully",
      appointments,
    })
  }catch(err:any){
    return res.status(500).json({message:"Internal server error", error:err.message})
  }
}

export const getAppointmentById = async (req: any, res: any) => {
  try {
    const { id } = req.params
    const appointment = await Appointment.findById(id)

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      })
    }

    res.status(200).json({
      success: true,
      message: "Appointment fetched successfully",
      appointment,
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

export const updateAppointment = async (req: any, res: any) =>{
  try {
    const { id } = req.params
    const updateData = req.body

    const appointment = await Appointment.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      })
    }

    res.status(200).json({
      success: true,
      message: "Appointment updated successfully",
      appointment,
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

export const deleteAppointment = async (req: any, res: any) => {
  try {
    const { id } = req.params
    const appointment = await Appointment.findByIdAndDelete(id)
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      })
    }

    res.status(200).json({
      success: true,
      message: "Appointment deleted successfully",
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

