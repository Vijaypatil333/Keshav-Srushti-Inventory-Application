const mongoose = require("mongoose");

const rawMaterialSchema = new mongoose.Schema(
  {
    inventoryType: {
      type: String,
      required: [true, "Inventory type is required"],
    },
    date: {
      type: String,
      required: [true, "Date is required"],
    },
    rawMaterial: {
      //mongoose.Schema.Types.ObjectId
      type: String,
      ref: "users",
      required: [true, "Raw Material is required"],
    },
    purchasedFrom: {
      type: String,
      required: [true, "Purchased From is required"],
    },
    billNo: {
      type: String,
      required: [true, "Bill No is required"],
    },
    rate: {
      type: String,
      required: [true, "Rate is required"],
    },
    usedFor: {
      type: String,
      required: [true, "Used For is required"],
    },
    batchNo: {
      type: String,
      required: [true, "Batch number is required"],
    },
    batchSize: {
      type: String,
      required: [true, "Batch size is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity of product is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Raw-Material", rawMaterialSchema);
