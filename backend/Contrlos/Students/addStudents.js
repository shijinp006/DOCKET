import AllowedStudent from "../../Models/Student/studentSchema.js";

export const createStudent = async (req, res) => {
  try {
    const { regNo, email } = req.body;

    if (!regNo || !email) {
      return res.status(400).json({ error: "Register number and email are required" });
    }

    const newStudent = await AllowedStudent.create({
      registerNumber: regNo.toUpperCase().trim(),
      email: email.toLowerCase().trim(),
    });

    return res.status(201).json({
      message: "Student added successfully",
      student: newStudent,
    });

  } catch (error) {
    // Duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        error: "Register Number already exists",
      });
    }

    console.error("Create student error:", error.message);
    return res.status(500).json({ error: "Server error" });
  }
};