import bcrypt from "bcrypt";
import AllowedAdmin from "../../Models/Admin/adminSchema.js";

export const addAllowedAdmin = async (req, res) => {
  try {
    const adminId = "ADMIN001";
    const password = "admin123";

    if (!adminId || !password) {
      return res.status(400).json({
        success: false,
        message: "adminId and password are required",
      });
    }

    // Check if admin already exists
    const existing = await AllowedAdmin.findOne({ adminId });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists",
      });
    }

    // 🔐 Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newAdmin = await AllowedAdmin.create({
      adminId,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "Allowed admin added successfully",
      data: {
        _id: newAdmin._id,
        adminId: newAdmin.adminId,
      }, // Never return password
    });

  } catch (error) {
    console.error("Add allowed admin error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};