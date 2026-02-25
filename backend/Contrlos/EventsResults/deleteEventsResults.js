import mongoose from "mongoose";
import EventResult from "../../Models/EventResult/eventResultSchema.js";

/**
 * Delete Single Event Result
 */
export const deleteEventResult = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid result ID",
      });
    }

    const deletedResult = await EventResult.findByIdAndDelete(id);

    if (!deletedResult) {
      return res.status(404).json({
        success: false,
        message: "Event result not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Result deleted successfully",
      data: deletedResult,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};