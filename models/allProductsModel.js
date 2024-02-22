const mongoose = require("mongoose");

const allProductsSchema = new mongoose.Schema(
  {
    productName: {
      //mongoose.Schema.Types.ObjectId
      type: String,
      ref: "users",
      required: [true, "Product is required"],
    },
    packing: {
      type: String,
      required: [true, "Packing is required"],
    },
    bufferSize: {
      type: Number,
      required: [true, "Buffer Size is required"],
    },
    manufacturingDays: {
      type: Number,
      required: [true, "Days of Manufacturing is required"],
    },
    packingDays: {
      type: Number,
      required: [true, "Days of Packing is required"],
    },
    totalDays: {
      type: Number,
      required: [true, "Total Days is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("All-products", allProductsSchema);
