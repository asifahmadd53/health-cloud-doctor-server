import upload from "../config/multer-config";
import { generateTimeSlots } from "../helpers/slotGeneration";
import ClinicSchedule from "../models/ClinicSchedule";
import doctorProfile from "../models/doctorProfile";
import doctorAuth from "../models/doctors";

export const updateDoctorProfile = [
  upload.single("profileImage"),
  async (req: any, res: any) => {
    try {
      const doctorId = req.user.id;

      const {
        name,
        email,
        phoneNumber,
        specialty,
        years,
        consultationFee,
        certifications,
        professionalBio,
        clinicAddress,
        city,
      } = req.body;
      const file = req.file;

      const updatedAuth = await doctorAuth.findByIdAndUpdate(
        doctorId,
        { name, email: email.trim().toLowerCase(), phoneNumber },
        { new: true, runValidators: true }
      );

      if (!updatedAuth)
        return res
          .status(404)
          .json({ success: false, message: "Doctor not found" });

      let profileData: any = {
        specialty: Array.isArray(specialty)
          ? specialty
          : specialty?.split(",").map((s: string) => s.trim()) || [],
        years,
        consultationFee,
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
      return res
        .status(404)
        .json({ success: false, message: "Doctor profile not found" });
    }

    // Validate schedules
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

    // Generate slots for each day
    const schedulesWithSlots = schedules.map((day: any) => {
      const generatedSlots = generateTimeSlots(day);

      return {
        day: day.day,
        isWorking: day.isWorking,
        startTime: day.startTime,
        endTime: day.endTime,
        hasBreak: day.hasBreak,
        breakStart: day.breakStart,
        breakEnd: day.breakEnd,
        patientPerHour: Number(day.patientPerHour),
        availableSlots: generatedSlots,
        totalSlots: generatedSlots.length,
      };
    });

    let doctorSchedule = await ClinicSchedule.findOne({ doctor: profile._id });

    if (doctorSchedule) {
      // Update existing schedule
      doctorSchedule.weeklySchedule = schedulesWithSlots;
      await doctorSchedule.save();
    } else {
      // Create new schedule
      doctorSchedule = await ClinicSchedule.create({
        doctor: profile._id,
        weeklySchedule: schedulesWithSlots,
      });
    }

    res.status(201).json({
      success: true,
      message: "Weekly schedule with slots saved successfully",
      schedule: doctorSchedule,
    });
  } catch (error: any) {
    console.error("Schedule creation error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating schedule",
      error: error.message,
    });
  }
};

// UPDATED: Single API that returns schedule WITH all slots


// export const createSchedule = async (req: any, res: any) => {
//   try {
//     const doctorAuthId = req.user?.id;
//     const { schedules } = req.body;

//     const profile = await doctorProfile.findOne({ doctor: doctorAuthId });
//     if (!profile) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Doctor profile not found" });
//     }

//     // Validate schedules
//     for (let day of schedules) {
//       if (day.isWorking) {
//         if (!day.startTime || !day.endTime) {
//           return res.status(400).json({
//             success: false,
//             message: `${day.day}: Start and end time are required`,
//           });
//         }

//         if (day.startTime >= day.endTime) {
//           return res.status(400).json({
//             success: false,
//             message: `${day.day}: Start time must be before end time`,
//           });
//         }

//         if (!day.patientPerHour || Number(day.patientPerHour) <= 0) {
//           return res.status(400).json({
//             success: false,
//             message: `${day.day}: patientPerHour must be a positive number`,
//           });
//         }

//         if (day.hasBreak) {
//           if (
//             !day.breaks ||
//             !Array.isArray(day.breaks) ||
//             day.breaks.length === 0
//           ) {
//             return res.status(400).json({
//               success: false,
//               message: `${day.day}: At least one break with start and end time is required`,
//             });
//           }

//           for (let br of day.breaks) {
//             if (!br.breakStart || !br.breakEnd) {
//               return res.status(400).json({
//                 success: false,
//                 message: `${day.day}: Break start and end time required`,
//               });
//             }
//             if (br.breakStart >= br.breakEnd) {
//               return res.status(400).json({
//                 success: false,
//                 message: `${day.day}: Break start must be before break end`,
//               });
//             }
//           }
//         }
//       }
//     }

//     // Generate slots for each day
//     const schedulesWithSlots = schedules.map((day: any) => {
//       const generatedSlots = generateTimeSlots(day);

//       return {
//         day: day.day,
//         isWorking: day.isWorking,
//         startTime: day.startTime,
//         endTime: day.endTime,
//         hasBreak: day.hasBreak,
//         breaks: day.breaks || [], // store multiple breaks
//         patientPerHour: Number(day.patientPerHour),
//         consultationFee: Number(day.consultationFee || 0), // NEW FIELD
//         availableSlots: generatedSlots,
//         totalSlots: generatedSlots.length,
//       };
//     });

//     let doctorSchedule = await ClinicSchedule.findOne({ doctor: profile._id });

//     if (doctorSchedule) {
//       doctorSchedule.weeklySchedule = schedulesWithSlots;
//       await doctorSchedule.save();
//     } else {
//       doctorSchedule = await ClinicSchedule.create({
//         doctor: profile._id,
//         weeklySchedule: schedulesWithSlots,
//       });
//     }

//     res.status(201).json({
//       success: true,
//       message: "Weekly schedule with slots saved successfully",
//       schedule: doctorSchedule,
//     });
//   } catch (error: any) {
//     console.error("Schedule creation error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error creating schedule",
//       error: error.message,
//     });
//   }
// };



export const getSchedule = async (req: any, res: any) => {
  try {
    const doctorAuthId = req.user?.id;

    const doctorProfileDoc = await doctorProfile.findOne({
      doctor: doctorAuthId,
    });
    if (!doctorProfileDoc) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor profile not found" });
    }

    const schedule = await ClinicSchedule.findOne({
      doctor: doctorProfileDoc._id,
    });

    if (!schedule) {
      return res
        .status(404)
        .json({ success: false, message: "Schedule not found" });
    }

    // Calculate summary statistics
    const summaryStats = {
      totalWorkingDays: schedule.weeklySchedule.filter((day) => day.isWorking)
        .length,
      totalSlots: schedule.weeklySchedule.reduce(
        (sum, day) => sum + (day.totalSlots || 0),
        0
      ),
      totalBookedSlots: schedule.weeklySchedule.reduce((sum, day) => {
        const bookedCount =
          day.availableSlots?.filter((slot) => slot.isBooked).length || 0;
        return sum + bookedCount;
      }, 0),
      breakDays: schedule.weeklySchedule.filter(
        (day) => day.isWorking && day.hasBreak
      ).length,
    };

    // Add computed fields to each day
    const enrichedSchedule = schedule.weeklySchedule.map((day) => ({
      day: day.day,
      isWorking: day.isWorking,
      startTime: day.startTime,
      endTime: day.endTime,
      hasBreak: day.hasBreak,
      breakStart: day.breakStart,
      breakEnd: day.breakEnd,
      patientPerHour: day.patientPerHour,
      totalSlots: day.totalSlots,
      availableSlots: day.availableSlots, // ALL SLOTS with booking status
      bookedSlotsCount:
        day.availableSlots?.filter((slot) => slot.isBooked).length || 0,
      availableSlotsCount:
        day.availableSlots?.filter((slot) => !slot.isBooked).length || 0,
    }));

    res.status(200).json({
      success: true,
      schedule: {
        _id: schedule._id,
        doctor: schedule.doctor,
        weeklySchedule: enrichedSchedule,
        createdAt: schedule.createdAt,
        updatedAt: schedule.updatedAt,
      },
      summary: summaryStats, // Bonus: Overall statistics
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};