const mongoose = require("mongoose");

const BufferedProductsSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: [true, "Date is required"],
    },
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("buffered-products", BufferedProductsSchema);
