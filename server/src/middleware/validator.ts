import Joi from "joi";

export const signUpSchema = Joi.object({
  name: Joi.string().required().trim().messages({
    "string.empty": "Name is required",
  }),
  pmdcNumber: Joi.string().required().trim().messages({
    "string.empty": "PMDC number is required",
  }),
  email: Joi.string().email().required().trim().messages({
    "string.email": "Please provide a valid email",
    "string.empty": "Email is required",
  }),
  phoneNumber: Joi.string().required().trim().messages({
    "string.empty": "Phone number is required",
  }),
  password: Joi.string().min(8).required().messages({
    "string.min": "Password must be at least 8 characters",
    "string.empty": "Password is required",
  }),
});

export const loginSchema = Joi.object({
  pmdcNumber: Joi.string().required().trim().messages({
    "string.empty": "PMDC number is required",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
});

export const emailSchema = Joi.object({
  email: Joi.string().email().required().trim().messages({
    "string.email": "Please provide a valid email",
    "string.empty": "Email is required",
  }),
});

export const verificationSchema = Joi.object({
  email: Joi.string().email().required().trim().messages({
    "string.email": "Please provide a valid email",
    "string.empty": "Email is required",
  }),
  verificationCode: Joi.string().length(4).required().messages({
    "string.length": "Verification code must be 4 digits",
    "string.empty": "Verification code is required",
  }),
});

export const resetPasswordSchema = Joi.object({
  newPassword: Joi.string().min(8).required().messages({
    "string.min": "Password must be at least 8 characters",
    "string.empty": "New password is required",
  }),
});

export const addStaffSchema = Joi.object({
  name: Joi.string().required().trim().messages({
    "string.empty": "Name is required",
  }),
  role: Joi.string().required().trim().messages({
    "string.empty": "Role is required",
  }),
  password: Joi.string().min(4).required().messages({
    "string.min": "Password must be at least 4 characters",
    "string.empty": "Password is required",
  }),
  email: Joi.string().email().required().trim().messages({
    "string.email": "Please provide a valid email",
  }),
  phone: Joi.string().required().trim().messages({
    "string.empty": "Phone is required",
  }),
  address: Joi.string().required().trim().messages({
    "string.empty": "Address is required",
  }),
  bio: Joi.string().required().trim().messages({
    "string.empty": "Bio is required",
  }),
});

export const staffLoginSchema = Joi.object({
  email: Joi.string().email().required().trim().messages({
    "string.email": "Please provide a valid email",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
});

// export const appointmentSchema = Joi.object({
//   patientName: Joi.string().required().trim().messages({
//     "string.empty": "Patient Name is required",
//   }),
//   patientCNIC: Joi.string().required().trim().messages({
//     "string.empty": "Patient CNIC is required",
//   }),
//   patientPhone: Joi.string().required().trim().messages({
//     "string.empty": "Patient Phone is required",
//   }),
//   patientAge: Joi.number().required().messages({
//     "number.base": "Patient Age must be a number",
//     "number.empty": "Patient Age is required",
//   }),
//   gender: Joi.string().required().trim().messages({
//     "string.empty": "Gender is required",
//   }),
//   date: Joi.date().required().messages({
//     "date.base": "Date must be a valid date",
//     "date.empty": "Date is required",
//   }),
//   time: Joi.string().required().trim().messages({
//     "string.empty": "Time is required",
//   }),
//   paymentStatus: Joi.string().required().trim().messages({
//     "string.empty": "Payment status is required",
//   }),
// });