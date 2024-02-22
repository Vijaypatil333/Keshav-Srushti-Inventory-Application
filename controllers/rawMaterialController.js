const rawMaterialModel = require("../models/rawMaterialModel");
const userModel = require("../models/userModel");

// create inventory
const createRawMaterialController = async (req, res) => {
  try {
    const { email } = req.body;
    //validation
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new error("User not Found");
    }
    const requestedRawMaterial = req.body.rawMaterial;
    const requestedQuantity = req.body.quantity;
    const bufferedSize = req.body.buffer;

    const rawMaterialData = {
      inventoryType: req.body.inventoryType,
      date: req.body.date,
      rawMaterial: req.body.rawMaterial,
      purchasedFrom: req.body.purchasedFrom,
      billNo: req.body.billNo,
      rate: req.body.rate,
      usedFor: req.body.usedFor,
      batchNo: req.body.batchNo,
      batchSize: req.body.batchSize,
      quantity: req.body.quantity,
    };

    if (req.body.inventoryType == "OUT") {
      //calculate quantity
      const totalInOfRequestedQuantity = await rawMaterialModel.aggregate([
        {
          $match: {
            rawMaterial: requestedRawMaterial,
            inventoryType: "IN",
          },
        },
        {
          $group: {
            _id: "$rawMaterial",
            total: { $sum: "$quantity" },
          },
        },
      ]);
      //console.log("Total In", totalInOfRequestedQuantity);
      const totalIn = totalInOfRequestedQuantity[0]?.total || -1;

      if (totalIn == -1) {
        return res.status(500).send({
          success: false,
          message: `${requestedRawMaterial.toUpperCase()} is NOT available`,
        });
      }

      //calculate out quantity
      const totalOutOfRequestedQuantity = await rawMaterialModel.aggregate([
        {
          $match: {
            rawMaterial: requestedRawMaterial,
            inventoryType: "OUT",
          },
        },
        {
          $group: {
            _id: "$rawMaterial",
            total: { $sum: "$quantity" },
          },
        },
      ]);
      const totalOut = totalOutOfRequestedQuantity[0]?.total || 0;

      //calculate in & out
      const availableQuantity = totalIn - totalOut;
      //quantity validation
      if (availableQuantity < requestedQuantity) {
        return res.status(500).send({
          success: false,
          message: `Only ${availableQuantity} ${requestedRawMaterial.toUpperCase()} is available`,
        });
      }
      const remainingQuantity = availableQuantity - requestedQuantity;
      //console.log(remainingQuantity, bufferedSize);

      //save record
      const RawMaterial = new rawMaterialModel(rawMaterialData);
      await RawMaterial.save();
      
      if (remainingQuantity <= bufferedSize) {
        const isbufferedMaterial = true;

        return res.status(201).send({
          success: true,
          message: `Now, Only ${remainingQuantity} ${requestedRawMaterial.toUpperCase()} is in stock So, adding ${requestedRawMaterial.toUpperCase()} in Bufferd Materials`,
          isbufferedMaterial,
        });
      } else {
        const isbufferedMaterial = false;
        return res.status(201).send({
          success: true,
          message: "Material removed successfully",
          isbufferedMaterial,
        });
      }
    } else {
      //calculate quantity
      const totalInOfRequestedQuantity = await rawMaterialModel.aggregate([
        {
          $match: {
            rawMaterial: requestedRawMaterial,
            inventoryType: "IN",
          },
        },
        {
          $group: {
            _id: "$rawMaterial",
            total: { $sum: "$quantity" },
          },
        },
      ]);
      //console.log("Total In", totalInOfRequestedQuantity);
      const totalIn = totalInOfRequestedQuantity[0]?.total || 0;

      //calculate out quantity
      const totalOutOfRequestedQuantity = await rawMaterialModel.aggregate([
        {
          $match: {
            rawMaterial: requestedRawMaterial,
            inventoryType: "OUT",
          },
        },
        {
          $group: {
            _id: "$rawMaterial",
            total: { $sum: "$quantity" },
          },
        },
      ]);
      const totalOut = totalOutOfRequestedQuantity[0]?.total || 0;

      //calculate in & out
      const availableQuantity = totalIn - totalOut;
      const newQuantity = Number(availableQuantity) + Number(requestedQuantity);

      //save record
      const RawMaterial = new rawMaterialModel(rawMaterialData);
      await RawMaterial.save();

      if (availableQuantity > bufferedSize || newQuantity <= bufferedSize) {
        const notBufferedMaterial = false;
        return res.status(201).send({
          success: true,
          message: "New Raw Material saved successfully",
          notBufferedMaterial,
        });
      } else {
        const notBufferedMaterial = true;
        return res.status(201).send({
          success: true,
          message: `Now, ${newQuantity} ${requestedRawMaterial.toUpperCase()} is in stock So, removing ${requestedRawMaterial.toUpperCase()} from Buffered Materials`,
          notBufferedMaterial,
        });
      }
      //console.log(availableQuantity)
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Failed to add New record",
      error,
    });
  }
};

//get all records
const getRawMaterialController = async (req, res) => {
  try {
    const RawMaterial = await rawMaterialModel
      //{ product : req.body.userId }
      .find() //query to find all records
      //.populate({inventoryType : "Medicine"})
      //.populate('product')
      .sort({ date: -1 }) // sort the dates is descending order (-1)
      .lean();

    // Convert the date strings to ISO format for sorting
    RawMaterial.forEach((item) => {
      item.dateISO = new Date(
        item.date.split("/").reverse().join("-")
      ).toISOString();
    });

    // Sort the inventory based on the ISO-formatted dates
    const sortedRawMaterial = RawMaterial.sort((a, b) => {
      return new Date(b.dateISO) - new Date(a.dateISO);
    });

    // Remove the temporary dateISO property if you don't need it in the result
    sortedRawMaterial.forEach((item) => {
      delete item.dateISO;
    });
    return res.status(200).send({
      success: true,
      message: "Got all records",
      RawMaterial,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in getting all inventory",
      error,
    });
  }
};

//delete inventory
const deleteRawMaterialController = async (req, res) => {
  try {
    const response = await rawMaterialModel.findByIdAndDelete(req.params._id);
    if (response) {
      return res.status(200).send({
        success: true,
        message: "Record deleted successfully",
      });
    } else {
      return res.status(500).send({
        success: false,
        message: "error in Record deleting ",
      });
    }
  } catch (error) {
    console.error("Error occurred while deleting the record", error);
  }
};

//get searched records
const getSearchedRawMaterialController = async (req, res) => {
  try {
    const rawMaterialName = req.params.searchQuery;
    const RawMaterial = await rawMaterialModel
      .find({ rawMaterial: { $regex: new RegExp(rawMaterialName, "i") } })
      .sort({ date: -1 }) // sort the dates is descending order (-1)
      .lean();

    // Convert the date strings to ISO format for sorting
    RawMaterial.forEach((item) => {
      item.dateISO = new Date(
        item.date.split("/").reverse().join("-")
      ).toISOString();
    });

    // Sort the inventory based on the ISO-formatted dates
    const sortedRawMaterial = RawMaterial.sort((a, b) => {
      return new Date(b.dateISO) - new Date(a.dateISO);
    });

    // Remove the temporary dateISO property if you don't need it in the result
    sortedRawMaterial.forEach((item) => {
      delete item.dateISO;
    });

    //calculate quantity
    const totalInOfRequestedQuantity = await rawMaterialModel.aggregate([
      {
        $match: {
          rawMaterial: { $regex: new RegExp(rawMaterialName, "i") },
          inventoryType: "IN",
        },
      },
      {
        $group: {
          _id: "$rawMaterial",
          total: { $sum: "$quantity" },
        },
      },
    ]);
    console.log("Total In", totalInOfRequestedQuantity);
    const totalIn = totalInOfRequestedQuantity[0]?.total;

    //calculate out quantity
    const totalOutOfRequestedQuantity = await rawMaterialModel.aggregate([
      {
        $match: {
          rawMaterial: { $regex: new RegExp(rawMaterialName, "i") },
          inventoryType: "OUT",
        },
      },
      {
        $group: {
          _id: "$rawMaterial",
          total: { $sum: "$quantity" },
        },
      },
    ]);
    const totalOut = totalOutOfRequestedQuantity[0]?.total || 0;

    //calculate in & out
    const availableQuantity = totalIn - totalOut;

    return res.status(200).send({
      success: true,
      message: "Got searched records",
      RawMaterial,
      availableQuantity,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in getting searched record",
      error,
    });
  }
};

module.exports = {
  createRawMaterialController,
  getRawMaterialController,
  deleteRawMaterialController,
  getSearchedRawMaterialController,
};
