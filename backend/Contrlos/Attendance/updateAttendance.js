import Attendance from "../../Models/Attendance/attendanceSchema.js";

/**
 * Update Attendance Status
 */
export const updateAttendanceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const allowedStatuses = ["pending", "present", "absent"];
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid attendance status",
      });
    }

    const updatedAttendance = await Attendance.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedAttendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Attendance status updated successfully",
      data: updatedAttendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};