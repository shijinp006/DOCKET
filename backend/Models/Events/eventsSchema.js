import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    programId: {
      type: String,
      required: true,
    },

    programName: {
      type: String,
      required: true,
      trim: true,
    },

    eventName: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    date: {
      type: String, // or Date if you prefer proper date handling
      required: true,
    },

    startTime: {
      type: String,
    },

    endTime: {
      type: String,
    },

    venue: {
      type: String,
      trim: true,
    },

    latitude: {
      type: Number,
    },

    longitude: {
      type: Number,
    },

    incharge: {
      type: String,
      trim: true,
    },

    department: {
      type: String,
      trim: true,
    },

    participationType: {
      type: String,
      enum: ["individual", "team"],
    },

    overallIndividualLimit: {
      type: Number,
      default: 0,
    },

    departmentIndividualLimit: {
      type: Number,
      default: 0,
    },

    membersPerTeamFromDepartment: {
      type: Number,
      default: 0,
    },

    teamsPerDepartment: {
      type: Number,
      default: 0,
    },

    poster: {
      type: String, // image URL or path
    },

    priceImage: {
      type: String,
    },

    sponsorImages: {
      type: [String], // array of image URLs
    },

    status: {
      type: String,
      default: "pending",
      enum: ["pending", "approved", "rejected"],
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

const Event = mongoose.model("Event", eventSchema);

export default Event;