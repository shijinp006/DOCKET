import bcrypt from "bcrypt";
import User from "../../Models/User/UserSchema.js";

export const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      registerNumber,
      department,
      mobile,
      semester,
      admissionNumber,
      gender,
      designation,
      qualification,
    } = req.body;

    // Basic validation
    if (!name || !email || !password || !role || !registerNumber) {
      return res.status(400).json({ error: "Required fields are missing" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { registerNumber: registerNumber.toUpperCase() }],
    });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      registerNumber: registerNumber.toUpperCase(),
      department,
      mobile,
      semester,
      admissionNumber,
      gender,
      designation,
      qualification,
      profilePicture : null, // Set default profile picture to null
    });

    return res.status(201).json({
      message: "User registered successfully",
      userId: newUser._id,
    });

  } catch (error) {
    console.error("Register error:", error.message);
    return res.status(500).json({ error: "Server error" });
  }
};