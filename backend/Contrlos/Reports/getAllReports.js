import Report from "../../Models/Reports/reportsSchema.js";

/**
 * Get All Reports
 * Optional query params:
 * ?page=1&limit=10
 */
export const getAllReports = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 0; // 0 = no limit
    const skip = (page - 1) * limit;

    const query = Report.find().sort({ createdAt: -1 });

    if (limit > 0) {
      query.skip(skip).limit(limit);
    }

    const reports = await query;

    const total = await Report.countDocuments();

    res.status(200).json({
      success: true,
      count: reports.length,
      total,
      page: limit > 0 ? page : null,
      data: reports,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};