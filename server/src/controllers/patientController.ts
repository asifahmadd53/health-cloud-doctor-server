import Appointment from "../models/appointment";
import ClinicSchedule from "../models/ClinicSchedule";
import doctorProfile from "../models/doctorProfile";
import { PatientAuth } from "../models/patientAuth";
import PatientProfile from "../models/patientProfile";

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

    const doctor = await doctorProfile.findById(id).populate({
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
    };

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

export const makeAppointmentByPatient = async (req: any, res: any) => {
  try {
    const patientAuthId = req.user?.id;
    if (!patientAuthId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const patientAuth = await PatientAuth.findById(patientAuthId).lean();
    if (!patientAuth) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const patientProfile = await PatientProfile.findOne({
      patient: patientAuth._id,
    });

    const {
      doctorProfileId,
      day,
      date,
      slotTime,
      clinicScheduleSlotId,
      paymentStatus,
    } = req.body;

   if (!doctorProfileId || !day || !slotTime || !clinicScheduleSlotId || !date) {
  return res.status(400).json({ message: "Missing required fields" });
}

    // ✅ FIX: Try to find schedule with doctorProfileId first
    let schedule = await ClinicSchedule.findOne({ doctor: doctorProfileId });

    // ✅ FIX: If not found, get the doctor's auth ID and try again
    if (!schedule) {
      const doctor = await doctorProfile.findById(doctorProfileId);
      if (doctor && doctor.doctor) {
        schedule = await ClinicSchedule.findOne({ doctor: doctor.doctor });
      }
    }

    if (!schedule) {
      return res.status(404).json({ message: "Doctor schedule not found" });
    }

    const daySchedule = schedule.weeklySchedule.find((d: any) => d.day === day);

    if (!daySchedule || !daySchedule.isWorking) {
      return res
        .status(400)
        .json({ message: "Doctor not available on this day" });
    }

    const slot = daySchedule.availableSlots.id(clinicScheduleSlotId);
    if (!slot) {
      return res.status(400).json({ message: "Invalid slot selected" });
    }

    if (slot.isBooked) {
      return res.status(400).json({ message: "Slot already booked" });
    }

   const duplicate = await Appointment.findOne({
     doctor: doctorProfileId,
     clinicScheduleSlotId,
     date: new Date(req.body.date), // ✅ DATE INCLUDED
   });


    if (duplicate) {
      return res.status(400).json({ message: "Slot already booked" });
    }

    const appointment = await Appointment.create({
      doctor: doctorProfileId,
      patientId: patientAuthId,
      patientPhone: patientAuth.patientNumber,
      patientName: patientProfile?.name,
      gender: patientProfile?.gender,
      day,
      date: new Date(date),
      time: slotTime,
      slotTime,
      clinicScheduleSlotId,
      paymentStatus: paymentStatus || "pending",
    });

    slot.isBooked = true;
    slot.appointmentId = appointment._id;
    await schedule.save();

    return res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (error: any) {
    console.error("❌ Booking error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};