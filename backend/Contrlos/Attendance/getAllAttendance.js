import Attendance from "../../Models/Attendance/attendanceSchema.js";

/**
 * Get All Attendance Records
 */
export const getAllAttendance = async (req, res) => {
  try {
    const attendanceRecords = await Attendance.find()
      .populate("eventId", "eventName date venue")
      .populate("userId", "name registerNumber department")
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: attendanceRecords.length,
      data: attendanceRecords,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};