// import upload from "../config/multer-config";
// import transport from "../middleware/sendMail";
// import { loginSchema, signUpSchema, updatePasswordSchema } from "../middleware/validator";
// import doctors from "../models/doctors";
// import { doCompare, doHash, hmacProcess } from "../utils/hashing";
// import jwt from "jsonwebtoken";
// import { Request, Response } from "express";
// import dotenv from "dotenv";

// dotenv.config();


// export const signUp = [
//   upload.single("pmdcCopy"),
//   async (req: any, res: any) => {
//     try {
//       const { name, pmdcNumber, email, phoneNumber, password } = req.body;

//       const { error } = signUpSchema.validate(req.body);
//       if (error) {
//         return res.status(400).json({ message: error.details[0].message });
//       }

//       const existingUser = await doctors.findOne({ $or: [{ pmdcNumber }, { email }] });
//       if (existingUser) {
//         return res.status(400).json({ message: "User already exists" });
//       }

//       const image = req.file;
//       if (!image || !image.buffer) {
//         return res.status(400).json({ message: "PMDC image is required!" });
//       }

//       const imageBase64 = image.buffer.toString("base64");
//       const imageMimeType = image.mimetype;
//       const imageSrc = `data:${imageMimeType};base64,${imageBase64}`;

//       const hashedPassword = await doHash(password, 12);

//       const newUser = await doctors.create({
//         name,
//         pmdcNumber,
//         email,
//         phoneNumber,
//         password: hashedPassword,
//         pmdcCopy: imageSrc,
//       });


//       return res.status(201).json({ success: true, message: "User created successfully", user: newUser });
//     } catch (err: any) {
//       console.error("Signup error:", err.message);
//       return res.status(500).json({ message: "Internal Server Error" });
//     }
//   },
// ];


// export const login = async(req:any,res:any)=>{
//     try{
//         const {pmdcNumber,password} = req.body;
//         const {error} = loginSchema.validate(req.body);
//         if(error){
//             return res.status(400).json({message:error.details[0].message})
//         }
//         const user = await doctors.findOne({pmdcNumber})
//         if(!user){
//             return res.status(400).json({message:"Invalid pmdc number or password"})
//         }
//         const passwordMatch = await doCompare(password,user.password)
//         if(!passwordMatch){
//             return res.status(400).json({message:"Invalid pmdc number or password"})
//         }
//         const token = jwt.sign({userId:user._id},process.env.JWT_SECRET as string,{expiresIn:"24h"})
//         res.status(200).json({
//           success: true,
//           message: "Login successful",
//           token,
//           user
//         });
//     }catch(err){
//         res.status(500).json({message:"Internal server error"})
//     }
// }


// export const sendVerificationEmail = async (req: any, res: any) => {
//   try {
//       const { email } = req.body;
//       // Changed to findOne to align with the code's intent
//       const user = await doctors.findOne({ email });

//       if (!user) {
//           return res.status(400).json({ message: "User not found" });
//       }

//       if (user.isApproved) {
//           return res.status(400).json({ message: "User already verified" });
//       }

//       const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();

//       // Added error handling for sendMail
//       let info = await transport.sendMail({
//           from: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
//           to: email,
//           subject: "Verification Code from HealthCloud",
//           text: `Your verification code is ${verificationCode}`,
//           html: `<h2>Your verification code is ${verificationCode}</h2>`,
//       });

//       if (info.accepted.length > 0) {
//           const hashedCode = await hmacProcess(verificationCode);
//           // Added error handling for findByIdAndUpdate
//           await doctors.findByIdAndUpdate(user._id, {
//               verificationCode: hashedCode,
//               verificationCodeExpires: Date.now() + 24 * 60 * 60 * 1000,
//           });
//           return res.status(200).json({
//               success: true,
//               message: "Verification code sent to email",
//           });
//       } else {
//           //Check for rejected emails.
//           if(info.rejected.length > 0){
//              console.error("Failed to send email.  Rejected recipients:", info.rejected);
//              return res.status(400).json({ message: "Failed to send verification code.  Email was rejected." });
//           }
//           else{
//              return res.status(400).json({ message: "Failed to send verification code" });
//           }
//       }
//   } catch (err) {
//       console.error("Error sending verification email:", err);
//       return res.status(500).json({ message: "Internal server error" });
//   }
// };


// export const verifyEmail = async (req: any, res: any) => {
//   try {
//     const { email, verificationCode } = req.body;

//     // Check if both email and verificationCode are present in the body
//     if (!email || !verificationCode) {
//       return res.status(400).json({ message: "Email and verification code are required" });
//     }

//     const user = await doctors.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "User not found" });
//     }

//     if (
//       !user.verificationCode || 
//       !user.verificationCodeExpires || 
//       new Date(user.verificationCodeExpires).getTime() < Date.now()
//     ) {
//       return res.status(400).json({ message: "Verification code expired or invalid" });
//     }

//     // Ensure the verification code is a string before calling toString()
//     const code = verificationCode.toString();

//     // Hash the verification code and compare with the stored code
//     const hashedCode = await hmacProcess(code);

//     if (hashedCode !== user.verificationCode) {
//       return res.status(400).json({ message: "Invalid verification code" });
//     }

//     // Update the user status to verified
//     await doctors.findByIdAndUpdate(user._id, {
//       isVerified: true,
//       verificationCode: null,
//       verificationCodeExpires: null
//     });

//     return res.status(200).json({
//       success: true,
//       message: "Email verified successfully"
//     });

//   } catch (err) {
//     console.error("Error verifying email:", err);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };

// export const resetPassword = async (req: any, res: any) => {
//   try {
//     const { newPassword } = req.body;  
//     const { error } = updatePasswordSchema.validate(req.body);
//     if (error) {
//       return res.status(400).json({ message: error.details[0].message });
//     }

//     // Check if user ID is provided
//     if (!req.params.id) {
//       return res.status(400).json({ message: "User ID is required" });
//     }

//     // Find the user first to ensure they exist
//     const user = await doctors.findById(req.params.id);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const hashedPassword = await doHash(newPassword, 12);

//     // Update the user's password
//     const updatedUser = await doctors.findByIdAndUpdate(
//       req.params.id,
//       {
//         password: hashedPassword,
//         verificationCode: null,
//         verificationCodeExpires: null
//       },
//       { new: true } // Return the updated document
//     );

//     if (!updatedUser) {
//       return res.status(500).json({ message: "Failed to update password" });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Password updated successfully",
//     });
//   } catch (err) {
//     console.error("Error resetting password:", err);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };

import { Request, Response } from "express";
import crypto from "crypto";
import doctors from "../models/doctors";
import { doCompare, doHash } from "../utils/hashing";
import jwt from "jsonwebtoken";
import { loginSchema, signUpSchema, emailSchema, verificationSchema, resetPasswordSchema } from "../middleware/validator";
import transport from "../middleware/sendMail";
import upload from "../config/multer-config";
import dotenv from "dotenv";

dotenv.config();


const generateVerificationCode = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

export const signUp = [
  upload.single("pmdcCopy"),
  async (req:any, res:any) => {
    try {
      const { name, pmdcNumber, email, phoneNumber, password } = req.body;

      const { error } = signUpSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const existingUser = await doctors.findOne({ $or: [{ pmdcNumber }, { email }] });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const file = req.file;
      if (!file || !file.buffer) {
        return res.status(400).json({ message: "PMDC image is required!" });
      }

      const imageBase64 = file.buffer.toString("base64");
      const imageMimeType = file.mimetype;
      const imageSrc = `data:${imageMimeType};base64,${imageBase64}`;

      const hashedPassword = await doHash(password, 12);

      const newUser = await doctors.create({
        name,
        pmdcNumber,
        email,
        phoneNumber,
        password: hashedPassword,
        pmdcCopy: imageSrc,
      });

      return res.status(201).json({ success: true, message: "User created successfully", user: newUser });
    } catch (err: any) {
      console.error("Signup error:", err.message);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
];

export const login = async (req:any, res:any) => {
  try {
    const { pmdcNumber, password } = req.body;
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    
    const user = await doctors.findOne({ pmdcNumber });
    if (!user) {
      return res.status(400).json({ message: "Invalid PMDC number or password" });
    }
    
    const passwordMatch = await doCompare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid PMDC number or password" });
    }
    
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "24h" }
    );
    
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendVerificationEmail = async (req:any, res:any) => {
  try {
    const { email } = req.body;
    
    // Validate email
    const { error } = emailSchema.validate({ email });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    
    // Find user by email
    const user = await doctors.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found with this email" });
    }
    
    // Generate verification code
    const verificationCode = generateVerificationCode();
    
    // Set expiration time (15 minutes from now)
    const verificationCodeExpires = new Date();
    verificationCodeExpires.setMinutes(verificationCodeExpires.getMinutes() + 15);
    
    // Update user with verification code
    user.verificationCode = verificationCode;
    user.verificationCodeExpires = verificationCodeExpires;
    await user.save();
    
    // Send email with verification code
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@healthcloud.com',
      to: email,
      subject: 'Password Reset Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #0891b2; text-align: center;">Health Cloud Password Reset</h2>
          <p>Hello,</p>
          <p>You requested to reset your password. Please use the following verification code to continue:</p>
          <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
            ${verificationCode}
          </div>
          <p>This code will expire in 15 minutes.</p>
          <p>If you didn't request this, please ignore this email or contact support if you have concerns.</p>
          <p>Thank you,<br>Health Cloud Team</p>
        </div>
      `
    };
    
    await transport.sendMail(mailOptions);
    
    return res.status(200).json({ 
      success: true, 
      message: "Verification code sent to your email" 
    });
    
  } catch (err: any) {
    console.error("Send verification code error:", err.message);
    return res.status(500).json({ message: "Failed to send verification code" });
  }
};

export const verifyEmail = async (req:any, res:any) => {
  try {
    const { email, verificationCode } = req.body;
    
    // Validate request
    const { error } = verificationSchema.validate({ email, verificationCode });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    
    // Find user by email
    const user = await doctors.findOne({ 
      email,
      verificationCode,
      verificationCodeExpires: { $gt: new Date() } // Check if code hasn't expired
    });
    
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired verification code" });
    }
    
    // Generate a reset token that will be used for the password reset
    const resetToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "15m" }
    );
    
    // Clear verification code after successful verification
    user.verificationCode = "";
    user.verificationCodeExpires = new Date();
    await user.save();
    
    return res.status(200).json({ 
      success: true, 
      message: "Verification successful",
      resetToken
    });
    
  } catch (err: any) {
    console.error("Verify code error:", err.message);
    return res.status(500).json({ message: "Verification failed" });
  }
};

export const resetPassword = async (req:any, res:any) => {
  try {
    const { newPassword } = req.body;
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: "Authorization token required" });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Validate password
    const { error } = resetPasswordSchema.validate({ newPassword });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
      
      // Find user by ID
      const user = await doctors.findById(decoded.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Hash new password
      const hashedPassword = await doHash(newPassword, 12);
      
      // Update password
      user.password = hashedPassword;
      await user.save();
      
      return res.status(200).json({ 
        success: true, 
        message: "Password reset successful" 
      });
      
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    
  } catch (err: any) {
    console.error("Reset password error:", err.message);
    return res.status(500).json({ message: "Password reset failed" });
  }
};

export const logout = async (req:any, res:any) => {
  try {
    res.clearCookie('token');
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};



