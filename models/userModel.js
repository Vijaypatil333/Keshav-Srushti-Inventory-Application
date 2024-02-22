const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    secretKey: {
      type: String,
      required: [true, "Key is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", userSchema);
