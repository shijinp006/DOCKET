import User from "../../Models/User/UserSchema.js";

export const getAllUsers = async (req, res) => {
  console.log("hee");
  
  try {
    const { _id } = req.query;
    console.log(_id , "id from query");
    

    // If ID is provided → return single user
    if (_id) {
      const user = await User.findById(_id)

        .lean();

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      return res.json({
        success: true,
        data: user,
      });
    }

    // Otherwise → return all users
    const users = await User.find()

      .sort({ createdAt: -1 })
      .lean();

    return res.json({
      success: true,
      data: users,
    });

  } catch (error) {
    console.error("Get users error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};