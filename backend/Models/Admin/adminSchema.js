import mongoose from "mongoose";

const allowedAdminSchema = new mongoose.Schema(
  {
    adminId: {
      type: String,
      required: true,
      unique: true, // PRIMARY KEY equivalent
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const AllowedAdmin = mongoose.model(
  "AllowedAdmin",
  allowedAdminSchema
);

export default AllowedAdmin;