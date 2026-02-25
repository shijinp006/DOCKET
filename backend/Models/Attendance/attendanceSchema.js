import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
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

    status: {
      type: String,
      enum: ["pending", "present", "absent"],
      default: "pending",
    },
  },
  {
    timestamps: { createdAt: "date", updatedAt: false },
  }
);

// Prevent duplicate attendance for same user in same event
attendanceSchema.index({ eventId: 1, userId: 1 }, { unique: true });

const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance;