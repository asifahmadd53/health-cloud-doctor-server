// import { PatientAuth } from "../models/patientAuth";
// import { sendOtpService } from "../services/twilioService";

// export const generateOtp = () => {
//   return Math.floor(1000 + Math.random() * 9000).toString();
// };

// export const patientAuth = async (req: any, res: any) => {
//   try {
//     const { patientNumber } = req.body;
//     if (!patientNumber)
//       return res
//         .status(400)
//         .json({ success: false, message: "Phone number required" });

//     const otp = generateOtp();
//     const to = `+${patientNumber}`;

//     const result = await sendOtpService(to, otp);

//     if (result.sent) {
//       await saveOtp(patientNumber, otp);
//       return res.json({
//         success: true,
//         message: `OTP sent via ${result.method}`,
//       });
//     } else {
//       return res.status(500).json({
//         success: false,
//         message: "Failed to send OTP via both WhatsApp and SMS",
//       });
//     }
//   } catch (err: any) {
//     console.error("send error:", err.message);
//     return res
//       .status(500)
//       .json({ success: false, message: "Failed to send OTP" });
//   }
// };

// async function saveOtp(phone: string, otp: string) {
//   await PatientAuth.findOneAndUpdate(
//     { patientNumber: phone },
//     { otp, isVerified: false, createdAt: new Date() },
//     { upsert: true, new: true }
//   );
// }

// export const verifyOtp = async (req: any, res: any) => {
//   const { patientNumber, otp } = req.body;

//   if (!patientNumber || !otp) {
//     return res
//       .status(400)
//       .json({ success: false, message: "Phone and OTP required" });
//   }

//   try {
//     const patient = await PatientAuth.findOne({ patientNumber });

//     if (!patient) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Account not found" });
//     }

//     if (patient.otp !== otp) {
//       return res.status(400).json({ success: false, message: "Invalid OTP" });
//     }

//     patient.isVerified = true;
//     await patient.save();

//     return res.status(200).json({
//       success: true,
//       message: "OTP verified successfully. Login successful!",
//     });
//   } catch (error: any) {
//     console.error("❌ Error verifying OTP:", error.message);
//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };

import jwt from "jsonwebtoken";

import { PatientAuth } from "../models/patientAuth";
import { sendOtpService } from "../services/twilioService";

export const generateOtp = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

async function saveOtp(phone: string, otp: string) {
  await PatientAuth.findOneAndUpdate(
    { patientNumber: phone },
    { otp, isVerified: false, createdAt: new Date() },
    { upsert: true, new: true }
  );
};

export const patientAuth = async (req: any, res: any) => {
  try {
        const { patientNumber } = req.body;

        if (!patientNumber) {
          return res
            .status(400)
            .json({ success: false, message: "Phone number required" });
        }

    // Generate OTP and send

    

    const otp = generateOtp();
    const to = `+${patientNumber}`;
    const result = await sendOtpService(to, otp);

    if (!result.sent) {
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP via both WhatsApp and SMS",
      });
    }

    // Save OTP in DB
    await saveOtp(patientNumber, otp);

    // Create or update patient record
    const patient = await PatientAuth.findOneAndUpdate(
      { patientNumber },
      { isVerified: false, createdAt: new Date() },
      { upsert: true, new: true }
    );

    // Generate JWT token
    const token = jwt.sign(
      { id: patient._id, patientNumber: patient.patientNumber },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    // Return response
    const data = {
      patientNumber: patient.patientNumber,
      isVerified: patient.isVerified,
    };
    return res.json({
      success: true,
      message: `OTP sent via ${result.method}`,
      token,
      data,
    });
  } catch (err: any) {
    console.error("save error:", err.message);
    return res
      .status(500)
      .json({ success: false, message: "Failed to save number" });
  }
};

export const verifyOtp = async (req:any, res:any) => {
  const { patientNumber, otp } = req.body;

  if (!patientNumber || !otp) {
    return res
      .status(400)
      .json({ success: false, message: "Phone number and OTP are required" });
  }

  try {
    const patient = await PatientAuth.findOne({ patientNumber });

    if (!patient) {
      return res
        .status(404)
        .json({ success: false, message: "Account not found" });
    }

    if (patient.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    patient.isVerified = true;
    patient.otp = null;
    await patient.save();

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("OTP Verify Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

