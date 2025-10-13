import upload from "../config/multer-config";
import ClinicSchedule from "../models/ClinicSchedule";
import doctorProfile from "../models/doctorProfile";
import doctorAuth from "../models/doctors";

export const updateDoctorProfile = [
  upload.single("profileImage"),
  async (req: any, res: any) => {
    try {
      
    const doctorId = req.user.id

      const {
        name,
        email,
        phoneNumber,
        specialty,
        years,
        certifications,
        professionalBio,
        clinicAddress,
        city,
      } = req.body;
      const file = req.file;
      
      const updatedAuth = await doctorAuth.findByIdAndUpdate(
        doctorId,
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
        city,
      };

      if (file?.buffer) {
        const imageBase64 = file.buffer.toString("base64");
        profileData.profileImage = `data:${file.mimetype};base64,${imageBase64}`;
      }

      const updatedProfile = await doctorProfile.findOneAndUpdate(
        { doctor: doctorId },
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

    const doctorAuthId = req.user?.id;
    const { schedules } = req.body;

     const profile = await doctorProfile.findOne({ doctor: doctorAuthId });
    if (!profile) {
      return res.status(404).json({ success: false, message: "Doctor profile not found" });
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

    let doctorSchedule = await ClinicSchedule.findOne({ doctor: profile._id });
    if (doctorSchedule) {
      doctorSchedule.weeklySchedule = schedules;
      await doctorSchedule.save();
    } else {
      doctorSchedule = await ClinicSchedule.create({
        doctor: profile._id,
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
    const doctorAuthId = req.user?.id

    const doctorProfileDoc = await doctorProfile.findOne({ doctor: doctorAuthId });
    if (!doctorProfileDoc) {
      return res.status(404).json({ success: false, message: "Doctor profile not found" });
    }

    const schedule = await ClinicSchedule.findOne({ doctor: doctorProfileDoc._id });

    if (!schedule) {
      return res.status(404).json({ success: false, message: "Schedule not found" });
    }

    res.status(200).json({
      success: true,
      schedule, 
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




