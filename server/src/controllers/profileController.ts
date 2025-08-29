import upload from "../config/multer-config";
import ClinicSchedule from "../models/ClinicSchedule";
import doctorProfile from "../models/doctorProfile";
import doctorAuth from "../models/doctors";

export const updateDoctorProfile = [
  upload.single("profileImage"),
  async (req: any, res: any) => {
    try {
      const { id } = req.params;
      const {
        name,
        email,
        phoneNumber,
        specialty,
        years,
        certifications,
        professionalBio,
        clinicAddress,
      } = req.body;
      const file = req.file;

      const updatedAuth = await doctorAuth.findByIdAndUpdate(
        id,
        { name, email, phoneNumber },
        { new: true }
      );

      if (!updatedAuth)
        return res
          .status(404)
          .json({ success: false, message: "Doctor not found" });

      let profileData: any = {
        specialty,
        years,
        certifications,
        professionalBio,
        clinicAddress,
      };

      if (file?.buffer) {
        const imageBase64 = file.buffer.toString("base64");
        profileData.profileImage = `data:${file.mimetype};base64,${imageBase64}`;
      }

      const updatedProfile = await doctorProfile.findOneAndUpdate(
        { doctor: id },
        profileData,
        { new: true, upsert: true }
      );

      res.status(200).json({
        success: true,
        doctor: updatedAuth,
        profile: updatedProfile,
      });
    } catch (err: any) {
      console.log(err);
      res.status(500).json({ success: false, message: err.message });
    }
  },
];

export const createSchedule = async (req: any, res: any) => {
  try {
    const { doctor, schedules } = req.body;

    const doctorProfileDoc = await doctorProfile.findOne({ doctor });
    if (!doctorProfileDoc) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    
    
    for (let day of schedules) {
      if (day.startTime && day.endTime && day.startTime >= day.endTime) {
        return res.status(400).json({
          success: false,
          message: `${day.day}: Start time must be before end time`,
        });
      }
      if (day.hasBreak) {
        if (!day.breakStart || !day.breakEnd) {
          return res.status(400).json({
            success: false,
            message: `${day.day}: Break start and end time required`,
          });
        }
        if (day.breakStart >= day.breakEnd) {
          return res.status(400).json({
            success: false,
            message: `${day.day}: Break start must be before break end`,
          });
        }
      }
    }

    let doctorSchedule = await ClinicSchedule.findOne({ doctor });
    if (doctorSchedule) {
      doctorSchedule.weeklySchedule = schedules; // update array
      await doctorSchedule.save();
    } else {
      doctorSchedule = await ClinicSchedule.create({
        doctor,
        weeklySchedule: schedules
      });
    }

    res.status(201).json({
      success: true,
      message: "Weekly schedule saved successfully",
      schedule: doctorSchedule,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error creating schedule",
      error: error.message,
    });
  }
};


export const getSchedule = async (req: any, res: any) => {
  try {
    const { doctorId } = req.params;

    // Find the schedule for this doctor
    const schedule = await ClinicSchedule.findOne({ doctor: doctorId });

    if (!schedule) {
      return res.status(404).json({ success: false, message: "Schedule not found" });
    }

    res.status(200).json({
      success: true,
      schedule, // contains weeklySchedule array
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




