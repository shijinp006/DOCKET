import mongoose from "mongoose";
import Program from "../../Models/Programs/programSchema.js";
import Event from "../../Models/Events/eventsSchema.js";

export const deleteProgram = async (req, res) => {
  try {
    const { id } = req.params;
    // console.log(id,"id");
    

    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //   return res.status(400).json({ error: "Invalid program ID" });
    // }

    // Check if program exists
    const program = await Program.findById(id);
    if (!program) {
      return res.status(404).json({ error: "Program not found" });
    }


    
    // Delete all related events
    await Event.deleteMany({ programId: id });

    // Delete program
    await Program.findByIdAndDelete(id);

    return res.json({
      message: "Program and associated events deleted successfully",
    });

  } catch (error) {
    console.error("Delete program error:", error.message);
    return res.status(500).json({
      error: "Server error",
    });
  }
};