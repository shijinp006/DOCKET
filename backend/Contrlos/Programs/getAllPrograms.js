import Program from "../../Models/Programs/programSchema.js";

export const getAllPrograms = async (req, res) => {
  // console.log("ss");
  
  try {
    const programs = await Program.find()
      .sort({ programDate: -1 }) // latest first
      .lean();

    return res.json(programs);

  } catch (error) {
    console.error("Get programs error:", error.message);
    return res.status(500).json({
      error: "Server error",
    });
  }
};