import Joi from "joi";

export const signUpSchema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    pmdcNumber: Joi.string().required(),
    email: Joi.string().email().required(),
    phoneNumber: Joi.string().required(),
    password: Joi.string().required(),
})

export const  loginSchema = Joi.object({
    pmdcNumber :Joi.string().required(),
    password: Joi.string().required(),
})