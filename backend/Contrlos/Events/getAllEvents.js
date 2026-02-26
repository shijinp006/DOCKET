import Event from "../../Models/Events/eventsSchema.js";

export const getAllEvents = async (req, res) => {
  console.log("kkk");
  
  
  try {
    const events = await Event.find()
      .sort({ date: 1 }) // upcoming first
      .populate("programId", "name category") // optional
      .lean();

    return res.json(events);

  } catch (error) {
    console.log("Get events error:", error.message);
    return res.status(500).json({
      error: "Server error",
    });
  }
};