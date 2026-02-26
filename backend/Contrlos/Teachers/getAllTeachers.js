import AllowedTeacher from "../../Models/Teacher/teacherSchema.js";

export const getAllTeachers = async (req, res) => {


  
  try {
    const teachers = await AllowedTeacher.find()
      .sort({ createdAt: -1 }) // newest first
      .lean();

    return res.json(teachers);

  } catch (error) {
    console.error("Get teachers error:", error.message);
    return res.status(500).json({ error: "Server error" });
  }
};