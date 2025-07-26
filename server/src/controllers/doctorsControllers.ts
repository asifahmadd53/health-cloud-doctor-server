import doctors from "../models/doctors";

export const getDoctors = async (req: any, res: any) => {
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

export const getDoctor = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const doctor = await doctors.findById(id);

    if (!doctor)
      return res
        .status(404)
        .json({ success: false, message: "Doctor not Found" });

    return res.status(200).json({
      success: true,
      message: "Doctor retrieved successfully",
      doctor,
    });
  } catch (error:any) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
