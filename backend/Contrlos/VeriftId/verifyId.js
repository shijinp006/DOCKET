import User from "../../Models/User/UserSchema.js";
import AllowedStudent from "../../Models/Student/studentSchema.js";
import AllowedTeacher from "../../Models/Teacher/teacherSchema.js";
import AllowedAdmin from "../../Models/Admin/adminSchema.js";

export const verifyId = async (req, res) => {
  try {
    const { registerNumber } = req.body;

    if (!registerNumber) {
      return res.status(400).json({ error: "ID is required" });
    }

    const id = registerNumber.toUpperCase();

    // 1️⃣ Check if already registered
    const existingUser = await User.findOne({ registerNumber: id });

    if (existingUser) {
      return res.json({
        status: "registered",
        email: existingUser.email,
        role: existingUser.role,
        message: "User already registered",
      });
    }

    // 2️⃣ Student
    if (id.startsWith("SFA")) {
      const student = await AllowedStudent.findOne({ registerNumber: id });

      if (!student) {
        return res
          .status(404)
          .json({ error: "Student ID not found in records." });
      }

      return res.json({
        status: "allowed",
        email: student.email,
        role: "student",
      });
    }

    // 3️⃣ Teacher
    if (id.startsWith("AED")) {
      const teacher = await AllowedTeacher.findOne({ teacherId: id });

      if (!teacher) {
        return res
          .status(404)
          .json({ error: "Teacher ID not found in records." });
      }

      return res.json({
        status: "allowed",
        email: teacher.email,
        role: "teacher",
      });
    }

    // 4️⃣ Admin
    if (id.startsWith("ADMIN")) {
      const admin = await AllowedAdmin.findOne({ adminId: id });

      if (!admin) {
        return res
          .status(404)
          .json({ error: "Admin ID not found in records." });
      }

      return res.json({
        status: "allowed",
        email: admin.email,
        role: "admin",
      });
    }

    return res.status(400).json({ error: "Invalid ID format." });

  } catch (error) {
    console.error("Verify ID error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};