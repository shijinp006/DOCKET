import User from "../../Models/User/UserSchema.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("name email role registerNumber department mobile semester")
      .sort({ createdAt: -1 }) // newest first
      .lean();

    return res.json(users);

  } catch (error) {
    console.error("Get users error:", error.message);
    return res.status(500).json({ error: "Server error" });
  }
};