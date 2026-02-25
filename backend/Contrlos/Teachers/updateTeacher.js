import AllowedTeacher from "../../Models/Teacher/teacherSchema.js";

export const updateTeacher = async (req, res) => {
  try {
    const { id } = req.params; // Old teacherId
    const { teacherId, email } = req.body;

    if (!teacherId || !email) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const updatedTeacher = await AllowedTeacher.findOneAndUpdate(
      { teacherId: id.toUpperCase() }, // Find by old teacherId
      {
        teacherId: teacherId.toUpperCase(),
        email: email.toLowerCase(),
      },
      { new: true } // Return updated document
    );

    if (!updatedTeacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    return res.json({
      message: "Teacher updated successfully",
      teacher: updatedTeacher,
    });

  } catch (error) {
    // Duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        error: "Teacher ID already exists",
      });
    }

    console.error("Update teacher error:", error.message);
    return res.status(500).json({ error: "Server error" });
  }
};