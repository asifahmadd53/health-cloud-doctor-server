import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const phone = "+923076916343";
const messageBody = "Your OTP code is 123456";

async function sendMessage() {
  try {
    const whatsappMessage = await client.messages.create({
      body: messageBody,
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: `whatsapp:${phone}`,
    });

    console.log("Sent via WhatsApp! SID:", whatsappMessage.sid);
  } catch (error) {
    console.warn("WhatsApp failed, sending SMS instead...");

    try {
      const smsMessage = await client.messages.create({
        body: messageBody,
        from: process.env.TWILIO_SMS_NUMBER, 
        to: phone,
      });

      console.log("Sent via SMS! SID:", smsMessage.sid);
    } catch (smsError:any) {
      console.error("Both WhatsApp and SMS failed:", smsError.message);
    }
  }
}

sendMessage();
