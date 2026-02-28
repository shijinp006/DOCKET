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
      return res.status(400).json({ error: "Invalid program ID" });
    }

    const programExists = await Program.findById(programId);
    if (!programExists) {
      return res.status(404).json({ error: "Associated program not found" });
    }

    let poster = null;
    let priceImage = null;
    let sponsorImages = [];

    if (req.files && req.files.length > 0) {
      const imageFiles = req.files.filter(file =>
        file.mimetype.startsWith("image/")
      );

      if (imageFiles.length > 0) {
        poster = imageFiles[0].filename;
      }

      if (imageFiles.length > 1) {
        priceImage = imageFiles[1].filename;
      }

      if (imageFiles.length > 2) {
        sponsorImages = imageFiles
          .slice(2)
          .map(file => file.filename);
      }
    }

    const newEvent = await Event.create({
      programId,
      programName,
      eventName: eventName.trim(),
      description,
      date,
      startTime,
      endTime,
      venue,
      latitude: latitude ? Number(latitude) : undefined,
      longitude: longitude ? Number(longitude) : undefined,
      incharge,
      department,
      participationType,
      overallIndividualLimit: Number(overallIndividualLimit) || 0,
      departmentIndividualLimit: Number(departmentIndividualLimit) || 0,
      membersPerTeamFromDepartment:
        Number(membersPerTeamFromDepartment) || 0,
      teamsPerDepartment: Number(teamsPerDepartment) || 0,
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
    console.error("Create event error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};  