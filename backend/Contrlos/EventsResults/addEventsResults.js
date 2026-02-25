import mongoose from "mongoose";
import EventResult from "../../Models/EventResult/eventResultSchema.js";

/**
 * Create Event Results (Bulk Insert by Prize Levels)
 * Expected format:
 * {
 *   eventId,
 *   eventName,
 *   results: [
 *     { prizeLevel, winners: [{ name, registerNumber }] }
 *   ]
 * }
 */
export const createEventResults = async (req, res) => {
  try {
    const { eventId, eventName, results } = req.body;

    if (!eventId || !eventName || !Array.isArray(results)) {
      return res.status(400).json({
        success: false,
        message: "Invalid data format",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid eventId",
      });
    }

    const documents = results.map((item) => ({
      eventId,
      eventName,
      prizeLevel: item.prizeLevel,
      winners: item.winners || [],
      announcedAt: new Date(),
    }));

    const createdResults = await EventResult.insertMany(documents);

    res.status(201).json({
      success: true,
      message: "Results announced successfully",
      count: createdResults.length,
      data: createdResults,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};