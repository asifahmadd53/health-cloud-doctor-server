import doctors from "../models/doctors";

export const getDoctors = async (req:any, res:any) => {
  try {
    const doctorsList = await doctors.find();
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