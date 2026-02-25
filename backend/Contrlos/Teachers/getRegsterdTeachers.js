import User from "../../Models/User/UserSchema.js";


/**
 * Get All Registered Teachers
 */
export const getRegisteredTeachers = async (req, res) => {
  try {
    const teachers = await User.find({ role: "teacher" })
      .select("name department registerNumber")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: teachers.length,
      data: teachers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};