const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    inventoryType: {
      type: String,
      required: [true, "Inventory type is required"],
    },
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
    consumer: {
      type: String,
      required: [true, "Consumer is required"],
    },
    batchSize: {
      type: String,
      required: [true, "Batch size is required"],
    },
    batchNo: {
      type: String,
      required: [true, "Batch number is required"],
    },
    packing: {
      type: String,
      required: [true, "Packing is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity of product is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Inventory", inventorySchema);
