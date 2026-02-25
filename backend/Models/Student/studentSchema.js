import mongoose from "mongoose";

const allowedStudentSchema = new mongoose.Schema(
  {
    registerNumber: {
      type: String,
      required: true,
      unique: true, // PRIMARY KEY equivalent
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true, // optional but recommended
  }
);

const AllowedStudent = mongoose.model(
  "AllowedStudent",
  allowedStudentSchema
);

export default AllowedStudent;