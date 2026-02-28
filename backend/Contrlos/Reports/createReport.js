import Report from "../../Models/Reports/reportsSchema.js";

/**
 * Create Report
 */
export const createReport = async (req, res) => {
  try {
    const { programName, description } = req.body;
    console.log(req.body,"report");
    

    if (!programName || !description) {
      return res.status(400).json({
        success: false,
        message: "programName and description are required",
      });
    }
    console.log(req.files,"files report");
    

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Image file is required",
      });
    }

    const newReport = await Report.create({
      programName: programName.trim(),
      description: description.trim(),
      image: req.files[0].filename, // 🔥 store filename only
    });

    res.status(201).json({
      success: true,
      message: "Report added successfully",
      data: newReport,
    });

  } catch (error) {
    console.error("Create report error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};