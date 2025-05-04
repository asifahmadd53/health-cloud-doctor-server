import upload from "../config/multer-config";
import { signUpSchema } from "../middleware/validator";
import doctors from "../models/doctors";
import { doHash } from "../utils/hashing";


export const signUp = [
  upload.single("pmdcCopy"),
  async (req: any, res: any) => {
    try {
      const { name, pmdcNumber, email, phoneNumber, password } = req.body;

      const { error } = signUpSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const existingUser = await doctors.findOne({ $or: [{ pmdcNumber }, { email }] });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const image = req.file;
      if (!image) {
        return res.status(400).json({ message: "PMDC image is required!!" });
      }

      const imageBase64 = image.buffer.toString("base64");
      const imageMimeType = image.mimetype;
      const imageSrc = `data:${imageMimeType};base64,${imageBase64}`;

      const hashedPassword = await doHash(password, 12);

      const newUser = await doctors.create({
        name,
        pmdcNumber,
        email,
        phoneNumber,
        password: hashedPassword,
        pmdcCopy: imageSrc,
      });

      return res.status(201).json({ success: true, message: "User created successfully", user: newUser });
    } catch (err: any) {
      console.error("Signup error:", err.message);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
];


// export const login = async(req:any,res:any)=>{
//     try{
//         const {pmdcNumber,password} = req.body;
//         const {error} = loginSchema.validate(req.body);
//         if(error){
//             return res.status(400).json({message:error.details[0].message})
//         }
//         const user = await doctors.findOne({pmdcNumber})
//         if(!user){
//             return res.status(400).json({message:"Invalid pmdc number or password"})
//         }
//         const passwordMatch = await doCompare(password,user.password)
//         if(!passwordMatch){
//             return res.status(400).json({message:"Invalid pmdc number or password"})
//         }
//         const token = jwt.sign({userId:user._id},process.env.JWT_SECRET as string,{expiresIn:"1h"})
//         res.status(200).json({message:"Login successful",token})
         
//     }catch(err){
//         res.status(500).json({message:"Internal server error"})
//     }
// }


console.log('HIIIIIIIIIIIIIIIIIIIIII')