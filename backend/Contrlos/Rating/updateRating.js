import Rating from "../../Models/Rating/ratingSchema.js";

/**
 * Create or Update Rating (Upsert)
 */
export const upsertRating = async (req, res) => {
  try {
    const { eventId, userId, rating, review } = req.body;

    // Basic validation
    if (!eventId || !userId || !rating) {
      return res.status(400).json({
        success: false,
        message: "eventId, userId and rating are required",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const updatedRating = await Rating.findOneAndUpdate(
      { eventId, userId }, // condition
      { rating, review },  // new values
      {
        new: true,
        upsert: true,          // create if not exists
        runValidators: true,   // enforce schema validation
        setDefaultsOnInsert: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Rating submitted successfully",
      data: updatedRating,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};