import Rating from "../../Models/Rating/ratingSchema.js";

/**
 * Get All Ratings
 * Optional query: ?eventId=xxxxx
 */
export const getAllRatings = async (req, res) => {
  try {
    const { eventId } = req.query;

    const filter = {};
    if (eventId) {
      filter.eventId = eventId;
    }

    const ratings = await Rating.find(filter)
      .populate("userId", "name email") // only fetch name & email
      .populate("eventId", "title")     // only fetch event title
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: ratings.length,
      data: ratings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};