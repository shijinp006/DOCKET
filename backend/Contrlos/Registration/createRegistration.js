import Registration from "../../Models/Registration/registrationSchema.js";

/**
 * Create Registration
 */
export const createRegistration = async (req, res) => {
  try {
    const {
      eventId,
      userId,
      userName,
      userEmail,
      registeredUserDept,
      participationType,
      teamData,
      status,
    } = req.body;

    // 🔍 Prevent duplicate registration (same user for same event)
    const existingRegistration = await Registration.findOne({
      eventId,
      userId,
    });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: "User already registered for this event",
      });
    }

    const registration = await Registration.create({
      eventId,
      userId,
      userName,
      userEmail,
      registeredUserDept,
      participationType,
      teamData: teamData || null,
      status: status || "pending",
    });

    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: registration,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};