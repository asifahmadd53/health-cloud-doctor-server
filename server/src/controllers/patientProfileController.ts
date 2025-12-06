import patientProfile from "../models/patientProfile";

export const createPatientProfile = async (req: any, res: any) => {
  try {
    const patientId = req.user.id;
    const { name } = req.body;

    const existingProfile = await patientProfile.findOne({
      patient: patientId,
    });
    if (existingProfile) {
      return res
        .status(400)
        .json({ message: "Profile already exists for this patient." });
    }

    const newProfile = new patientProfile({
      patient: patientId,
      name,
    });

    const savedProfile = await newProfile.save();
    res.status(201).json(savedProfile);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const getPatientProfile = async (req: any, res: any) => {
  try {
    const patientId = req.user.id;

    const profile = await patientProfile.findOne({ patient: patientId });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const updatePatientProfile = async (req:any, res:any) => {
  try {
    const patientId = req.user.id;
    const { name, gender, maritalStatus, dob, location } =
      req.body;

    const updatedProfile = await patientProfile.findOneAndUpdate(
      { patient: patientId },
      { name, gender, maritalStatus, dob, location },
      { new: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json(updatedProfile);
  } catch (error:any) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};



