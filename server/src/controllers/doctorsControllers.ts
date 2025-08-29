import doctorProfile from "../models/doctorProfile";
import doctorAuth from "../models/doctors";

export const getDoctors = async (req: any, res: any) => {
  try {
    const doctorsList = await doctorAuth.find();
    return res.status(200).json({
      success: true,
      message: "Doctors retrieved successfully.",
      doctors: doctorsList,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while retrieving doctors.",
      error: err.message || "Internal Server Error",
    });
  }
};

export const getDoctor = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const doctor = await doctorAuth.findById(id)
    if (!doctor)
      return res
        .status(404)
        .json({ success: false, message: "Doctor not Found" });

const profile = await doctorProfile.findOne({ doctor: id });

    res.status(200).json({
      success: true,
      doctor,   
      profile, 
    });
  } catch (error:any) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const updateDoctorStatus = async (req:any, res:any)=>{
  try{
      const {id} = req.params;
      const {isApproved} = req.body
      const updateDoctorStatus = await doctorAuth.findByIdAndUpdate(id,{isApproved}, {new:true})
      if(!updateDoctorStatus){
        return res.status(404).json({success:false, message:"Doctor not found"})
      }
      return res.status(200).json({
        success: true,
        message: "Doctor status updated successfully",
        });
    }catch(err:any){
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: err.message || "Internal Server Error",
      })
    }
} 

export const getPendingDoctors = async (req: any, res: any) => {
  try {
    const pendingDoctors = await doctorAuth.find({ isApproved: false });

    return res.status(200).json({
      success: true,
      message: "Pending doctors retrieved successfully",
      doctors: pendingDoctors,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


export const getApprovedDoctors = async (req: any, res: any) => {
  try {
    const approvedDoctors = await doctorAuth.find({ isApproved: true });

    return res.status(200).json({
      success: true,
      message: "Pending doctors retrieved successfully",
      doctors: approvedDoctors,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


// export const updateDoctorGender = async(req:any,res:any)=>{
//   try {
//     const { id } = req.params;
//     const { gender } = req.body;

//       const updatedGender = await doctors.findByIdAndUpdate(
//       id,
//       { gender },
//       { new: true }
//     );
//     if(updatedGender){
//       return res.status(200).json({
//         success: true,
//         message: "Doctor gender updated successfully",
//       })
//     }
//       if (!updatedGender) {
//       return res.status(404).json({ success: false, message: "Doctor not found" });
//     }

//   }catch(err:any){
//     return res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//       error: err.message,
//     })
//   }
// }


