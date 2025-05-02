import { signUpSchema } from "../middleware/validator";
import doctors from "../models/doctors";
import { doHash } from "../utils/hashing";


export const signUp = async(req:any, res:any)=>{
    let {name,pmdcNumber,email,phoneNumber,password,pmdcCopy} = req.body;
    const {error, value } = signUpSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }
    const hashedPassword = doHash(password,12)
    const newUser = await doctors.create({
        name,
        pmdcNumber,
        email,
        phoneNumber,
        password:hashedPassword,
        pmdcCopy
    })
    return res.status(201).json({message:"User created successfully",user:newUser})

}