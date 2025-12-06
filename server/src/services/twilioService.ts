import client from "../config/twilio";

export const sendOtpService = async (to: string, otp: string) => {
  let sent = false;

  try {
    await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: `whatsapp:${to}`,
      body: `Your OTP is ${otp}. Valid for 2 min. Don't share it.`,
    });
    sent = true;
    return { sent, method: "WhatsApp" };
  } catch (wErr: any) {
    console.warn("WhatsApp failed:", wErr.code || wErr.message);
  }

  if (!sent) {
    try {
      await client.messages.create({
        from: process.env.TWILIO_SMS_NUMBER,
        to,
        body: `Your OTP is ${otp}. Valid for 2 min. Don't share it.`,
      });
      sent = true;
      return { sent, method: "SMS" };
    } catch (sErr: any) {
      console.error("SMS send failed:", sErr.message);
      return { sent: false, method: "none" };
    }
  }

  return { sent: false, method: "none" };
};
