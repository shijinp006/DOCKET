import AllowedStudent from "../../Models/Student/studentSchema.js";

export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        error: "Register number is required",
      });
    }

    const deletedStudent = await AllowedStudent.findOneAndDelete({
      registerNumber: id.toUpperCase(),
    });

    if (!deletedStudent) {
      return res.status(404).json({
        error: "Student not found",
      });
    }

    return res.json({
      message: "Student deleted successfully",
    });

  } catch (error) {
    console.error("Delete student error:", error.message);
    return res.status(500).json({
      error: "Server error",
    });
  }
};