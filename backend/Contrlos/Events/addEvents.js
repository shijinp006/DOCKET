import mongoose from "mongoose";
import Event from "../../Models/Events/eventsSchema.js";
import Program from "../../Models/Programs/programSchema.js";

export const createEvent = async (req, res) => {
  try {
    const {
      programId,
      programName,
      eventName,
      description,
      date,
      startTime,
      endTime,
      venue,
      latitude,
      longitude,
      incharge,
      department,
      participationType,
      overallIndividualLimit,
      departmentIndividualLimit,
      membersPerTeamFromDepartment,
      teamsPerDepartment,
      status,
    } = req.body;

    if (!programId || !eventName || !date) {
      return res.status(400).json({
        error: "Program, event name, and date are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(programId)) {
      return res.status(400).json({
        error: "Invalid program ID",
      });
    }

    const programExists = await Program.findById(programId);
    if (!programExists) {
      return res.status(404).json({
        error: "Associated program not found",
      });
    }

    // 📂 Get uploaded files safely
    const poster = req.files?.poster
      ? `/uploads/${req.files.poster[0].filename}`
      : null;

    const priceImage = req.files?.priceImage
      ? `/uploads/${req.files.priceImage[0].filename}`
      : null;

    const sponsorImages = req.files?.sponsorImages
      ? req.files.sponsorImages.map(file => `/uploads/${file.filename}`)
      : [];

    const newEvent = await Event.create({
      programId,
      programName,
      eventName: eventName.trim(),
      description,
      date: new Date(date),
      startTime,
      endTime,
      venue,
      latitude,
      longitude,
      incharge,
      department,
      participationType,
      overallIndividualLimit,
      departmentIndividualLimit,
      membersPerTeamFromDepartment,
      teamsPerDepartment,
      poster,
      priceImage,
      sponsorImages,
      status: status || "pending",
    });

    return res.status(201).json({
      message: "Event created successfully",
      event: newEvent,
    });

  } catch (error) {
    console.error("Create event error:", error.message);
    return res.status(500).json({
      error: "Server error",
    });
  }
};