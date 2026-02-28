import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      required: true,
      enum: ["student", "teacher"], // same as your comment
    },

    registerNumber: {
      type: String,
      required: true,
      unique: true,
    },

    department: {
      type: String,
    },

    mobile: {
      type: String,
    },

    semester: {
      type: String,
    },

    admissionNumber: {
      type: String,
    },

    gender: {
      type: String,
    },

    designation: {
      type: String,
    },
    profilePicture: {
      type: String, // URL or file path to the profile picture
      default :null
    },
    qualification: {
      type: String,
    },
  },
  {
    timestamps: true, // automatically creates createdAt & updatedAt
  }
);

const User = mongoose.model("User", userSchema);

export default User;