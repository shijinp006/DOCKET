import Program from "../../Models/Programs/programSchema.js";

export const createProgram = async (req, res) => {
  try {
    const {
      name,
      category,
      title,
      programDate,
      programTime,
      description,
      features
    } = req.body;
    // console.log(req.body,"body");
    

    // console.log(req.files, "files");

    let imagePath = null;
    let brochurePath = null;

    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        if (file.mimetype === "application/pdf") {
          brochurePath = file.filename;
        } else if (file.mimetype.startsWith("image/")) {
          imagePath = file.filename; // only one image
        }
      });
    }

    if (
      !name ||
      !category ||
      !title ||
      !programDate ||
      !programTime ||
      !description
    ) {
      return res.status(400).json({
        error: "All required fields must be provided",
      });
    }
let parsedFeatures = [];

if (features) {
  try {
    parsedFeatures =
      typeof features === "string"
        ? JSON.parse(features)
        : features;
  } catch (err) {
    console.log("Invalid features JSON");
    parsedFeatures = [];
  }
}
    const newProgram = await Program.create({
      name: name.trim(),
      category: category.trim(),
      images: imagePath,
      brochure: brochurePath,
      title: title.trim(),
      programDate: new Date(programDate),
      programTime,
      description: description.trim(),
      features: parsedFeatures
    });

    return res.status(201).json({
      message: "Program created successfully",
      program: newProgram,
    });

  } catch (error) {
    console.error("Create program error:", error.message);
    return res.status(500).json({
      error: "Server error",
    });
  }
};