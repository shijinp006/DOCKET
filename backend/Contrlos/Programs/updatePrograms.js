import Program from "../../Models/Programs/programSchema.js";

export const updateProgram = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      category,
      image,
      brochure,
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

    const updatedProgram = await Program.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        category: category.trim(),
        image,
        brochure,
        title: title.trim(),
        programDate: new Date(programDate),
        programTime,
        description: description.trim(),
        features: Array.isArray(features) ? features : [],
      },
      {
        new: true,          // return updated document
        runValidators: true // enforce schema validation
      }
    );

    if (!updatedProgram) {
      return res.status(404).json({
        error: "Program not found",
      });
    }

    return res.json({
      message: "Program updated successfully",
      program: updatedProgram,
    });

  } catch (error) {
    console.error("Update program error:", error.message);
    return res.status(500).json({
      error: "Server error",
    });
  }
};