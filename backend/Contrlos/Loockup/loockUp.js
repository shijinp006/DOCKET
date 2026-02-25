import User from "../../Models/User/UserSchema.js";

export const lookupUserByRegisterNumber = async (req, res) => {
  try {
    const { regNo } = req.params;

    if (!regNo) {
      return res.status(400).json({ error: "Register number is required" });
    }

    const id = regNo.toUpperCase();

    // Select only needed fields
    const user = await User.findOne(
      { registerNumber: id },
      "name registerNumber department"
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json(user);

  } catch (error) {
    console.error("Lookup error:", error.message);
    return res.status(500).json({ error: "Server error" });
  }
};