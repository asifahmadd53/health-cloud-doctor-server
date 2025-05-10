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