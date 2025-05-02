import { signUpSchema } from "../middleware/validator";

export const signUp = async(req:any, res:any)=>{
    const {name, pmdcNumber, email, phoneNumber, password, pmdcCopy,termsAccepted } = req.body;

    try{
        const {error, value} = signUpSchema.validate(req.body);
        if(error){
        
        }
    }

}