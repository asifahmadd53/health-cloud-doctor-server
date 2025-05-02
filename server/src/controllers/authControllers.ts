import { signUpSchema } from "../middleware/validator";
import doctors from "../models/doctors";

export const signUp = async(req:any, res:any)=>{
    const {name, pmdcNumber, email, phoneNumber, password, pmdcCopy,termsAccepted } = req.body;

    try{
        const {error, value} = signUpSchema.validate(req.body);
        if(error){
            return res.status(400).json({ message: error.details[0].message })
        }
        const exsistingDr = doctors.findOne({pmdcNumber,email})
        
    }

}