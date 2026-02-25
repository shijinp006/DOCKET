import EventResult from "../../Models/EventResult/eventResultSchema.js";

/**
 * Get All Event Results
 * Optional query:
 * ?eventId=xxxx
 */
export const getAllEventResults = async (req, res) => {
  try {
    const { eventId } = req.query;

    const filter = {};
    if (eventId) {
      filter.eventId = eventId;
    }

    const results = await EventResult.find(filter)
      .populate("eventId", "eventName") // optional if linked
      .sort({ announcedAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};