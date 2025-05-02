import Joi from "joi";

export const signUpSchema = Joi.object({
    pmdcNumber : Joi.number().min(6),
    email: Joi.string().email({
        tlds: { allow: ['com', 'net', 'org'] }
    }).required().min(6).max(30).lowercase(),
    password:Joi.string().max(8)
})