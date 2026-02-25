import Report from "../../Models/Reports/reportsSchema.js";

/**
 * Create Report
 */
export const createReport = async (req, res) => {
  try {
    const { programName, image, description } = req.body;

    // Basic validation
    if (!programName || !image || !description) {
      return res.status(400).json({
        success: false,
        message: "programName, image, and description are required",
      });
    }

    const newReport = await Report.create({
      programName,
      image,
      description,
    });

    res.status(201).json({
      success: true,
      message: "Report added successfully",
      data: newReport,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};