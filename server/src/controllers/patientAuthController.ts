import client from "../config/twilio";
import { PatientAuth } from "../models/patientAuth";
import jwt from "jsonwebtoken";

export const generateOtp = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

export const pateintSignUp = async (req:any, res:any) => {
    try{
       const  { phone } = req.body;
         if(!phone){
        return res.status(400).json({ message: "Phone number is required" });
       }

       const otp = generateOtp();
      const body = `Your OTP code is: *${otp}*. Please do not share this code with anyone. This code will expire in 1 minute.`;

       await PatientAuth.findOneAndUpdate(
        { patientNumber: phone },
        { otp, isVerified: false, createdAt: new Date() },
        { upsert: true, new: true }
       );

       try{
        await client.messages.create({
            body,
            from: process.env.TWILIO_WHATSAPP_NUMBER,
            to: `whatsapp:${phone}`
        })
      return res.status(200).json({
        success: true,
        channel: "whatsapp",
        message: "OTP sent via WhatsApp",
      });
      
       }
        catch (error: any) {
      console.warn("⚠️ WhatsApp send failed, trying SMS instead:", error.message);

      await client.messages.create({
        body,
        from: process.env.TWILIO_SMS_NUMBER,
        to: phone,
      });
        return res.status(200).json({   
        success: true,
        channel: "sms",
        message: "OTP sent via SMS",
      });


    }    } catch (error) {
        console.error("❌ OTP send failed:", error);
        return res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
}


export const verifyOtp = async (req:any, res:any) => {
    try{
       const  { phone, otp } = req.body;
         if(!phone || !otp){
        return res.status(400).json({ message: "Phone number and OTP are required" });
       }
         const record = await PatientAuth.findOne({ patientNumber: phone });
         if(!record){
            return res.status(400).json({ message: "No OTP request found for this number" });
         }
            if(record.otp !== otp){
            return res.status(400).json({ message: "Invalid OTP" });
         }
            record.isVerified = true;
            await record.save();

            const token = jwt.sign({ patientId: record._id }, process.env.JWT_SECRET as string, { expiresIn: "24h" });
            return res.status(200).json({ 
                success: true, 
                message: "Phone number verified successfully",
                token,
             });

    } catch (error) {
        console.error("❌ OTP verification failed:", error);
        return res.status(500).json({ success: false, message: "Failed to verify OTP" });
  }
}