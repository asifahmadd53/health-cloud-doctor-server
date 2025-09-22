import { JsonWebTokenError } from "jsonwebtoken";
import upload from "../config/multer-config";
import { addStaffSchema, staffLoginSchema } from "../middleware/validator";
import staff from "../models/staff";
import { doCompare, doHash } from "../utils/hashing";
import jwt from "jsonwebtoken";

export const addStaff = [upload.single("profileImage"), async (req: any, res: any) => {
    try {
        const doctorId = req.user?.id;
        if (!doctorId) {
        return res.status(401).json({ message: "Unauthorized: Doctor not found in token" });
        }
        const { name, role, email, password, phone, address, bio } = req.body;
  
        const { error } = addStaffSchema.validate(req.body);
        if (error) {
          return res.status(400).json({ message: error.details[0].message });
        }
        const existingUser = await staff.findOne({ $or: [{ email }] });
        if (existingUser) {
          return res.status(400).json({ message: "Staff already exists" });
        }
  
        let imageSrc: string | null = null;
      if (req.file && req.file.buffer) {
        const imageBase64 = req.file.buffer.toString("base64");
        const imageMimeType = req.file.mimetype;
        imageSrc = `data:${imageMimeType};base64,${imageBase64}`;
      }

        const hashedPassword = await doHash(password, 12);
  
        const newUser = await staff.create({
          doctor: doctorId,
          name,
          role,
          email,
          phone,
          address,
          bio,
          password: hashedPassword,
          profileImage: imageSrc,
        });
  
        return res.status(201).json({ success: true, message: "Staff created successfully", staff: newUser });
      } catch (err: any) {
        console.error("Signup error:", err.message);
        return res.status(500).json({ message: "Internal Server Error" });
      }
}]

export const staffLogin = async (req: any, res: any) => {
    try {
        const { email, password } = req.body;
        const { error } = staffLoginSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const existingStaff = await staff.findOne({ email });
        if (!existingStaff) {
            return res.status(400).json({ message: "Staff not found" });
        }
        const isPasswordValid = await doCompare(password, existingStaff.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" });
        }
        
        const token = jwt.sign({ staffId: existingStaff._id }, process.env.JWT_SECRET as string, { expiresIn: "24h" });
        
        return res.status(200).json({ message: "Login successful", staff: existingStaff, token, success: true});
    } catch (error) {
        console.error("Login Error:", error); // Add this
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getStaff = async (req: any, res: any) => {
    try {
        const doctorId = req.user?.id
        
         if (!doctorId) {
      return res.status(401).json({ message: "Unauthorized: Doctor not found" });
    }
        const foundStaff = await staff.find({doctor: doctorId });
          if (!foundStaff || foundStaff.length === 0) {
      return res.status(404).json({ message: "No staff found for this doctor" });
    }
         return res.status(200).json({
      message: "Staff fetched successfully",
      staff: foundStaff,
      success: true,
    });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getStaffById = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const foundStaff = await staff.findById(id);
        if (!foundStaff) {
            return res.status(400).json({ message: "Staff not found" });
        }
        return res.status(200).json({ message: "Staff fetched successfully", staff: foundStaff, success: true});
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const deleteStaff = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const deletedStaff = await staff.findByIdAndDelete(id);
        if (!deletedStaff) {
            return res.status(400).json({ message: "Staff not found" });
        }
        return res.status(200).json({ message: "Staff deleted successfully", success: true});
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const updateStaff = [upload.single("profileImage"), async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const { name, role, email, phone, address, bio, profileImage } = req.body;
        const updatedStaff = await staff.findByIdAndUpdate(id, { name, role, email, phone, address, bio, profileImage }, { new: true });
        if (!updatedStaff) {
            return res.status(400).json({ message: "Staff not found" });
        }
        return res.status(200).json({ message: "Staff updated successfully", staff: updatedStaff, success: true});
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}]
