
import Appointment from "../models/appointment";
import doctorProfile from "../models/doctorProfile";
import Staff from "../models/staff";
import { Types } from 'mongoose';
// export const createAppointment = async (req: any, res: any) => {
//   try {
//     const {
//       patientName,
//       patientCNIC,
//       patientPhone,
//       patientAge,
//       gender,
//       date,
//       time,
//       paymentStatus
//     } = req.body;

//     // staffId comes from token (staff login)
//     const staffId = req.user?.staffId;
//     if (!staffId) {
//       return res.status(401).json({ message: "Unauthorized: Staff not found in token" });
//     }

//     // find staff details to get the linked doctor
//     const staffMember = await Staff.findById(staffId);
//     if (!staffMember) {
//       return res.status(404).json({ message: "Staff not found" });
//     }

//     const doctorId = staffMember.doctor;

//     const appointment = await Appointment.create({
//       staffId,
//       doctor: doctorId,
//       patientName,
//       patientCNIC,
//       patientPhone,
//       patientAge,
//       gender,
//       date,
//       time,
//       paymentStatus,
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Appointment created successfully",
//       appointment,
//     });
//   } catch (error: any) {
//     console.error("Appointment error:", error);
//     return res.status(500).json({
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };


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
      paymentStatus,
      reason,
    } = req.body;

    if (!patientName || !patientPhone) {
      return res.status(400).json({ message: 'Patient name and phone are required' });
    }

    
    let doctorRefId: string;
    if (req.user?.staffId) {
      const staff = await Staff.findById(req.user.staffId);
      if (!staff) return res.status(404).json({ message: 'Staff not found' });
      doctorRefId = staff.doctor.toString();

      if (!date || !time) {
        return res.status(400).json({ message: 'Date and time required for staff appointment' });
      }

      
      const existing = await Appointment.findOne({ doctor: doctorRefId, date, time });
      if (existing) {
        return res.status(400).json({ message: 'Doctor already has an appointment at this time' });
      }
    } else if (req.user?.id) {
      const profile = await doctorProfile.findOne({ doctor: req.user?.id }); // same as createSchedule
      if (!profile) {
        return res.status(404).json({ message: 'Doctor profile not found' });
      }
      doctorRefId = profile._id.toString();
    } else {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const appointment = await Appointment.create({
      staffId: req.user?.staffId || null,
      doctor: doctorRefId, 
      patientName,
      patientCNIC,
      patientPhone,
      patientAge,
      gender,
      date: req.user?.staffId ? date : null,
      time: req.user?.staffId ? time : null,
      paymentStatus,
      reason,
    });

    res.status(201).json({
      success: true,
      message: 'Appointment created successfully',
      appointment,
    });
  } catch (error: any) {
    console.error('Appointment error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getAppointments = async(req:any, res:any)=>{
  try{
    const staffId = req.user?.staffId;
    const staff = await Staff.findById(staffId).lean();
     if (!staff) return res.status(404).json({ message: "Staff not found" });
    const appointments = await Appointment.find({doctor: staff.doctor}).populate('staffId','name email').sort({createdAt:-1}).lean();
    if(appointments.length === 0){
      return res.status(404).json({message:"No appointments found"})
    }
    res.status(200).json({
      success: true,
      message: "Appointments fetched successfully",
      appointments,
    })
  }catch(err:any){
    return res.status(500).json({message:"Internal server error", error:err.message})
  }
}

export const getDoctorAppointments = async (req: any, res: any) => {
  try {
    const doctorId = req.user?.id;
    if (!doctorId) {
      return res.status(401).json({ message: "Unauthorized: Doctor not found in token" });
    }
    const appointments = await Appointment.find({ doctor: doctorId }).populate('staffId', 'name email').sort({ createdAt: -1 }).lean();
    if (appointments.length === 0) {
      return res.status(404).json({ message: "No appointments found" });
    } 
    res.status(200).json({
      success: true,
      message: "Appointments fetched successfully",
      appointments,
    });
  } catch (err: any) {
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
}

export const getDoctorAppointmentById = async (req: any, res: any) => {
  try {
    const doctorId = req.user?.id;
    if (!doctorId) {
      return res.status(401).json({ message: "Unauthorized: Doctor not found in token" });
    }
    const { id } = req.params;
    const appointment = await Appointment.findOne({ _id: id, doctor: doctorId }).populate('staffId', 'name email');
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json({
      success: true,
      message: "Appointment fetched successfully",
      appointment,
    });
  } catch (err: any) {
    return res.status(500).json({ message: "Internal server error", error: err.message });
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