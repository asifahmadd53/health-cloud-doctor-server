import ClinicSchedule from "../models/ClinicSchedule";
import doctorProfile from "../models/doctorProfile";

export const getDoctorsByPatient = async (req: any, res: any) => {
  try {
    const doctors = await doctorProfile.find().populate({
      path: "doctor",
      match: { isApproved: true },
      select: "name profileImage email phoneNumber pmdcNumber isApproved",
    });
    
    const approvedDoctors = doctors.filter((doc) => doc.doctor !== null);
    if (approvedDoctors.length === 0) {
      return res.status(404).json({ message: "No approved doctors found" });
    }
    return res.status(200).json({
      success: true,
      total: approvedDoctors.length,
      doctors: approvedDoctors,
    });
  } catch (error: any) {
    console.error("❌ Error fetching approved doctors:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch approved doctors",
      error: error.message,
    });
  }
};

export const getDoctorById = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const doctor = await doctorProfile
      .findById(id)
      .populate({
        path: "doctor",
        match: { isApproved: true },
        select: "name profileImage email phoneNumber pmdcNumber isApproved",
      });

    if (!doctor || !doctor.doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found or not approved",
      });
    }

    const schedule = await ClinicSchedule.findOne({ doctor: id }).select(
      "-weeklySchedule.availableSlots"
    );

    const doctorWithSchedule = {
      ...doctor.toObject(),
      schedule: schedule || null,
    }

    return res.status(200).json({
      success: true,
      doctor: doctorWithSchedule,
    });
  } catch (error: any) {
    console.error("❌ Error fetching doctor by ID:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch doctor",
      error: error.message,
    });
  }
};

