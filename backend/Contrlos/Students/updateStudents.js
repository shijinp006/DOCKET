import AllowedStudent from "../../Models/Student/studentSchema.js";

export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params; // old registerNumber
    const { regNo, email } = req.body;

    if (!regNo || !email) {
      return res.status(400).json({
        error: "Register number and email are required",
      });
    }

    const updatedStudent = await AllowedStudent.findOneAndUpdate(
      { registerNumber: id.toUpperCase() },
      {
        registerNumber: regNo.toUpperCase().trim(),
        email: email.toLowerCase().trim(),
      },
      {
        new: true,          // return updated document
        runValidators: true // enforce schema validation
      }
    );

    if (!updatedStudent) {
      return res.status(404).json({ error: "Student not found" });
    }

    return res.json({
      message: "Student updated successfully",
      student: updatedStudent,
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        error: "Register Number already exists",
      });
    }

    console.error("Update student error:", error.message);
    return res.status(500).json({ error: "Server error" });
  }
};