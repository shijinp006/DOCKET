import Program from "../../Models/Programs/programSchema.js";

export const createProgram = async (req, res) => {
  try {
    const {
      name,
      category,
      image,
      brochure,
      title,
      programDate,
      programTime,
      description,
      features
    } = req.body;
    // console.log(req.body,"body");
    



    // Basic validation
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

  
    const newProgram = await Program.create({
      name: name.trim(),
      category: category.trim(),
      image,
      brochure,
      title: title.trim(),
      programDate: new Date(programDate),
      programTime,
      description: description.trim(),
      features: Array.isArray(features) ? features : [],
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