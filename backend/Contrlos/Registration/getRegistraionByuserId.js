import Registration from "../../Models/Registration/registrationSchema.js";
import User from "../../Models/User/UserSchema.js";

/**
 * Get Registrations By User
 */
export const getRegistrationsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
   
    

    // 1️⃣ Find the user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 2️⃣ Find registrations
    const registrations = await Registration.find({
      $or: [
        { userId: userId }, // Individual registration
        {
          participationType: "team",
          "teamData.members.registerNumber": user.registerNumber,
        },
      ],
    })
      .populate("eventId", "eventName date venue")
      .sort({ registeredAt: -1 });

    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};