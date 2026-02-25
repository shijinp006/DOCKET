import mongoose from "mongoose";

const programSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String, // store image URL or file path
    },

    brochure: {
      type: String, // store brochure file path or URL
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    programDate: {
      type: Date, // better than TEXT
      required: true,
    },

    programTime: {
      type: String, // keep as string (e.g. "10:30 AM")
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    features: [
      {
        iconLabel: String,
        name: String,
      },
    ], // store as array instead of JSON string
  },
  {
    timestamps: true,
  }
);

const Program = mongoose.model("Program", programSchema);

export default Program;