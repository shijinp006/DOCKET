import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    review: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Prevent one user from rating same event multiple times
ratingSchema.index({ eventId: 1, userId: 1 }, { unique: true });

const Rating = mongoose.model("Rating", ratingSchema);

export default Rating;