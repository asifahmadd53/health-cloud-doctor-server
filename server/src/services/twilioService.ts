import client from "../config/twilio";
import dotenv from "dotenv";

dotenv.config();

const WHATSAPP_FALLBACK_ERRORS = [63038, 63007, 63003, 21211];

export const sendOtpService = async (to: string, otp: string) => {
  const whatsappFrom = process.env.TWILIO_WHATSAPP_NUMBER;
  const smsFrom = process.env.TWILIO_SMS_NUMBER;
  const message = `Your OTP is ${otp}. Valid for 2 minutes. Do not share it.`;

  console.log("to:", to);
  console.log("📞 whatsapp to:", `whatsapp:${to}`);
  
  try {
    await client.messages.create({
      from: whatsappFrom,
      to: `whatsapp:${to}`,
      body: message,
    });
    console.log("✅ OTP sent via WhatsApp");
    return { sent: true, method: "WhatsApp" };

  } catch (wErr: any) {
    console.warn(`⚠️ WhatsApp failed [${wErr.code}]: ${wErr.message}`);

    // ✅ Step 2: Fallback to SMS only for relevant errors
    if (WHATSAPP_FALLBACK_ERRORS.includes(wErr.code)) {
      try {
        await client.messages.create({
          from: smsFrom,
          to,
          body: message,
        });
        console.log("✅ OTP sent via SMS");
        return { sent: true, method: "SMS" };

      } catch (sErr: any) {
        console.error(`❌ SMS failed [${sErr.code}]: ${sErr.message}`);
        return { sent: false, method: "none", error: sErr.message };
      }
    }

    return { sent: false, method: "none", error: wErr.message };
  }
};