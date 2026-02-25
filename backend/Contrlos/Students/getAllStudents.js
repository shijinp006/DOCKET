import AllowedStudent from "../../Models/Student/studentSchema.js";

export const getAllStudents = async (req, res) => {
  try {
    const students = await AllowedStudent.find()
      .sort({ createdAt: -1 }) // newest first
      .lean();

    return res.json(students);

  } catch (error) {
    console.error("Get students error:", error.message);
    return res.status(500).json({ error: "Server error" });
  }
};