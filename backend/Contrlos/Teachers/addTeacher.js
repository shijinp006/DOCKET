import AllowedTeacher from "../../Models/Teacher/teacherSchema.js";

export const addTeacher = async (req, res) => {
  try {
    const { teacherId, email } = req.body;

    if (!teacherId || !email) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const newTeacher = await AllowedTeacher.create({
      teacherId: teacherId.toUpperCase(),
      email: email.toLowerCase(),
    });

    return res.status(201).json({
      message: "Teacher added successfully",
      teacher: {
        id: newTeacher._id,
        teacherId: newTeacher.teacherId,
        email: newTeacher.email,
      },
    });

  } catch (error) {
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        error: "Teacher ID already exists",
      });
    }

    console.error("Add teacher error:", error.message);
    return res.status(500).json({ error: "Server error" });
  }
};