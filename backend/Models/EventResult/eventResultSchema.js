import mongoose from "mongoose";

const winnerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    registerNumber: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const eventResultSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Program", // if linked to Program collection
    },

    eventName: {
      type: String,
      required: true,
    },

    prizeLevel: {
      type: String, // e.g. "First Prize", "Second Prize"
      required: true,
    },

    winners: [winnerSchema], // real structured array

    announcedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const EventResult = mongoose.model("EventResult", eventResultSchema);

export default EventResult;