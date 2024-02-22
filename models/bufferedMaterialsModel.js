const mongoose = require("mongoose");

const BufferedMaterialsSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: [true, "Date is required"],
    },
    rawMaterial: {
      //mongoose.Schema.Types.ObjectId
      type: String,
      ref: "users",
      required: [true, "Material is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("buffered-materials", BufferedMaterialsSchema);
