import Program from "../../Models/Programs/programSchema.js";

export const updateProgram = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      category,
      title,
      programDate,
      programTime,
      description,
      features,
    } = req.body;

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

    const existingProgram = await Program.findById(id);

    if (!existingProgram) {
      return res.status(404).json({
        error: "Program not found",
      });
    }

    // 🔥 Handle uploaded files
    let imagePath = existingProgram.image;
    let brochurePath = existingProgram.brochure;

    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        if (file.mimetype === "application/pdf") {
          brochurePath = file.filename;
        } else if (file.mimetype.startsWith("image/")) {
          imagePath = file.filename;
        }
      });
    }

    // 🔥 Parse features safely
    let parsedFeatures = [];
    if (features) {
      try {
        parsedFeatures =
          typeof features === "string"
            ? JSON.parse(features)
            : features;
      } catch (err) {
        parsedFeatures = [];
      }
    }

    const updatedProgram = await Program.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        category: category.trim(),
        images: imagePath,
        brochure: brochurePath,
        title: title.trim(),
        programDate: new Date(programDate),
        programTime,
        description: description.trim(),
        features: parsedFeatures,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return res.json({
      message: "Program updated successfully",
      program: updatedProgram,
    });

  } catch (error) {
    console.error("Update program error:", error);
    return res.status(500).json({
      error: "Server error",
    });
  }
};