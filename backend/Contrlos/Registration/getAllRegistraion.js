import Registration from "../../Models/Registration/registrationSchema.js";

/**
 * Get All Registrations
 */
export const getAllRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find()
      .populate("eventId", "eventName date venue")
      .populate("userId", "name email department")
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