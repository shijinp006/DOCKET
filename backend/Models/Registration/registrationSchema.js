import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema(
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

    userName: {
      type: String,
      required: true,
      trim: true,
    },

    userEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    registeredUserDept: {
      type: String,
      required: true,
      trim: true,
    },

    participationType: {
      type: String,
      enum: ["individual", "team"],
      required: true,
    },

    teamData: {
      type: Object, // Store JSON directly (no stringify needed)
      default: null,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: { createdAt: "registeredAt", updatedAt: true },
  }
);

const Registration = mongoose.model("Registration", registrationSchema);

export default Registration;