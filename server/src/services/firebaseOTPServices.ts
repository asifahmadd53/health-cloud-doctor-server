import { getAuth } from "firebase-admin/auth";
import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

export const sendOtpFirebase = async (phoneNumber: string) => {
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  await getAuth()
    .createUser({ phoneNumber })
    .catch(() => {});
  return otp;
};
