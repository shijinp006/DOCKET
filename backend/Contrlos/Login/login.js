import bcrypt from "bcrypt";
import User from "../../Models/User/UserSchema.js";
import AllowedAdmin from "../../Models/Admin/adminSchema.js";

export const loginUser = async (req, res) => {
  try {
    const { registerNumber, password } = req.body;
console.log(req.body,"body");

    if (!registerNumber || !password) {
      return res.status(400).json({ error: "Register number and password are required" });
    }

      if(registerNumber === "ADMIN001") {
        const admin = await AllowedAdmin.findOne({ adminId: registerNumber });
      
        
        if (!admin) {
          return res.status(401).json({ error: "Invalid admin credentials" });
        }
        // If admin exists, check password
        const isMatch = await bcrypt.compare(password, admin.password);
  
        if (!isMatch) {
          return res.status(401).json({ error: "Invalid admin credentials" });
        }
        return res.json({
          message: "Admin login successful",
          user: { ...admin.toObject(), role: "admin" },
        });
      }
    const id = registerNumber.toUpperCase();

    // Find user by register number
    const user = await User.findOne({ registerNumber: id });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Remove password from response
    const userObject = user.toObject();
    delete userObject.password;

    return res.json({
      message: "Login successful",
      user: userObject,
    });

  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({ error: "Server error" });
  }
};