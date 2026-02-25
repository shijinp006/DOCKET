    import mongoose from "mongoose";

    const reportSchema = new mongoose.Schema(
      {
        programName: {
          type: String,
          required: true,
          trim: true,
        },

        image: {
          type: String, 
          // Base64 string (as per your frontend logic)
          required: true,
        },

        description: {
          type: String,
          required: true,
          trim: true,
        },
      },
      {
        timestamps: { createdAt: true, updatedAt: false },
      }
    );

    const Report = mongoose.model("Report", reportSchema);

    export default Report;