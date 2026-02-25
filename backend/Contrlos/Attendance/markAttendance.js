import Attendance from "../../Models/Attendance/attendanceSchema.js";

/**
 * Mark Attendance
 */
export const markAttendance = async (req, res) => {
  try {
    const { eventId, userId, status } = req.body;

    // Optional: Validate status manually
    const allowedStatuses = ["pending", "present", "absent"];
    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid attendance status",
      });
    }

    // Check if attendance already exists
    const existing = await Attendance.findOne({ eventId, userId });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Attendance already marked for this user in this event",
      });
    }

    const attendance = await Attendance.create({
      eventId,
      userId,
      status: status || "pending",
    });

    res.status(201).json({
      success: true,
      message: "Attendance marked successfully",
      data: attendance,
    });
  } catch (error) {
    // Handle duplicate index error (extra safety)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Attendance already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};