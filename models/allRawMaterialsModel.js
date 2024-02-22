const mongoose = require("mongoose");

const allRawMaterials = new mongoose.Schema(
  {
    rawMaterial: {
      //mongoose.Schema.Types.ObjectId
      type: String,
      ref: "users",
      required: [true, "Raw material is required"],
    },
    bufferSize: {
      type: Number,
      required: [true, "Buffer Size is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("All-raw-materials", allRawMaterials);
