import mongoose from "mongoose";

const allowedTeacherSchema = new mongoose.Schema(
  {
    teacherId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
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
    timestamps: true,
  }
);

const AllowedTeacher = mongoose.model(
  "AllowedTeacher",
  allowedTeacherSchema
);

export default AllowedTeacher;