import AllowedTeacher from "../../Models/Teacher/teacherSchema.js";

export const deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Teacher ID is required" });
    }

    const deletedTeacher = await AllowedTeacher.findOneAndDelete({
      teacherId: id.toUpperCase(),
    });

    if (!deletedTeacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    return res.json({
      message: "Teacher deleted successfully",
    });

  } catch (error) {
    console.error("Delete teacher error:", error.message);
    return res.status(500).json({ error: "Server error" });
  }
};