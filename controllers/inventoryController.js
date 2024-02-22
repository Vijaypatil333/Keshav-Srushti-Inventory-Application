const inventoryModel = require("../models/inventoryModel");
const userModel = require("../models/userModel");

// create inventory
const createInventoryController = async (req, res) => {
  try {
    const { email } = req.body;
    //validation
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new error("User not Found");
    }
    const requestedProduct = req.body.productName;
    const requestedPacking = req.body.packing;
    const requestedQuantity = req.body.quantity;
    const bufferedSize = req.body.buffer;

    const inventoryData = {
      inventoryType: req.body.inventoryType,
      date: req.body.date,
      productName: req.body.productName,
      consumer: req.body.consumer,
      batchSize: req.body.batchSize,
      batchNo: req.body.batchNo,
      packing: req.body.packing,
      quantity: req.body.quantity,
    };

    if (req.body.inventoryType == "OUT") {
      //calculate quantity
      const totalInOfRequestedQuantity = await inventoryModel.aggregate([
        {
          $match: {
            productName: requestedProduct,
            inventoryType: "IN",
            packing: requestedPacking,
          },
        },
        {
          $group: {
            _id: "$productName",
            total: { $sum: "$quantity" },
          },
        },
      ]);
      //console.log("Total In", totalInOfRequestedQuantity);
      const totalIn = totalInOfRequestedQuantity[0]?.total || -1;

      if (totalIn == -1) {
        return res.status(500).send({
          success: false,
          message: `${requestedProduct.toUpperCase()} is NOT available`,
        });
      }

      //calculate out quantity
      const totalOutOfRequestedQuantity = await inventoryModel.aggregate([
        {
          $match: {
            productName: requestedProduct,
            inventoryType: "OUT",
            packing: requestedPacking,
          },
        },
        {
          $group: {
            _id: "$productName",
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
          message: `Only ${availableQuantity} ${requestedProduct.toUpperCase()} with ${requestedPacking} packing is in stock`,
        });
      }

      const remainingQuantity = availableQuantity - requestedQuantity;
      //console.log(remainingQuantity, bufferedSize);

      //save record
      const inventory = new inventoryModel(inventoryData);
      await inventory.save();

      if (
        remainingQuantity <= bufferedSize &&
        availableQuantity > bufferedSize
      ) {
        const isbufferedproduct = true;

        return res.status(201).send({
          success: true,
          message: `Now, Only ${remainingQuantity} ${requestedProduct.toUpperCase()} with ${requestedPacking} packing is in stock. So, adding ${requestedProduct.toUpperCase()} with ${requestedPacking} packing in Buffered Products`,
          isbufferedproduct,
        });
      } else {
        const isbufferedproduct = false;
        return res.status(201).send({
          success: true,
          message: "Product removed successfully",
          isbufferedproduct,
        });
      }
    } else {
      //calculate quantity
      const totalInOfRequestedQuantity = await inventoryModel.aggregate([
        {
          $match: {
            productName: requestedProduct,
            inventoryType: "IN",
            packing: requestedPacking,
          },
        },
        {
          $group: {
            _id: "$productName",
            total: { $sum: "$quantity" },
          },
        },
      ]);
      //console.log("Total In", totalInOfRequestedQuantity);
      const totalIn = totalInOfRequestedQuantity[0]?.total || 0;

      //calculate out quantity
      const totalOutOfRequestedQuantity = await inventoryModel.aggregate([
        {
          $match: {
            productName: requestedProduct,
            inventoryType: "OUT",
            packing: requestedPacking,
          },
        },
        {
          $group: {
            _id: "$productName",
            total: { $sum: "$quantity" },
          },
        },
      ]);
      const totalOut = totalOutOfRequestedQuantity[0]?.total || 0;

      //calculate in & out
      const availableQuantity = totalIn - totalOut;
      const newQuantity = Number(availableQuantity) + Number(requestedQuantity);

      //save record
      const inventory = new inventoryModel(inventoryData);
      await inventory.save();

      if (
        availableQuantity === 0 ||
        availableQuantity > bufferedSize ||
        newQuantity <= bufferedSize
      ) {
        const notBufferedProduct = false;
        return res.status(201).send({
          success: true,
          message: "New Product saved successfully",
          notBufferedProduct,
        });
      } else {
        const notBufferedProduct = true;
        return res.status(201).send({
          success: true,
          message: `Now, ${newQuantity} ${requestedProduct.toUpperCase()} with ${requestedPacking} packing is in stock So, removing ${requestedProduct.toUpperCase()} with ${requestedPacking} packing from Buffered Products`,
          notBufferedProduct,
        });
      }
      //console.log(availableQuantity)
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Failed to add New Product",
      error,
    });
  }
};

//get all records
const getInventoryController = async (req, res) => {
  try {
    const inventory = await inventoryModel
      //{ product : req.body.userId }
      .find() //query to find all records
      //.populate({inventoryType : "Medicine"})
      //.populate('product')
      .sort({ date: -1 }) // sort the dates is descending order (-1)
      .lean();

    // Convert the date strings to ISO format for sorting
    inventory.forEach((item) => {
      item.dateISO = new Date(
        item.date.split("/").reverse().join("-")
      ).toISOString();
    });

    // Sort the inventory based on the ISO-formatted dates
    const sortedInventory = inventory.sort((a, b) => {
      return new Date(b.dateISO) - new Date(a.dateISO);
    });

    // Remove the temporary dateISO property if you don't need it in the result
    sortedInventory.forEach((item) => {
      delete item.dateISO;
    });
    return res.status(200).send({
      success: true,
      message: "Got all records",
      inventory,
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

//get pred records
const getPredProductController = async (req, res) => {
  try {
    const season = req.params.currentSeason;
    // Determine the month range based on the season
    let monthRange;
    if (season === "Summer") {
      monthRange = ["03", "04", "05", "06"];
    } else if (season === "Monsoon") {
      monthRange = ["07", "08", "09", "10"];
    } else if (season === "Winter") {
      monthRange = ["11", "12", "01", "02"];
    } else {
      return res.status(400).send({
        success: false,
        message: "Invalid season provided",
      });
    }

    const prediction = await inventoryModel
      .aggregate([
        // Match documents based on criteria
        {
          $match: {
            inventoryType: "OUT",
            $expr: {
              $in: [
                {
                  $substr: ["$date", 3, 2],
                },
                monthRange,
              ],
            },
          },
        },
        // Group by product and calculate the sum of OUT values
        {
          $group: {
            _id: "$productName",
            totalOUT: { $sum: "$quantity" }, // Assuming there's a "quantity" field in your schema
          },
        },
        // Sort by totalOUT in descending order
        {
          $sort: { totalOUT: -1 },
        },
        // Limit to the first document (the one with the maximum OUT)
        {
          $limit: 1,
        },
      ])
      .exec();

    // Get the product name based on the result
    //const product = prediction[0];
    return res.status(200).send({
      success: true,
      message: "Got all records",
      prediction,
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
const deleteInventoryController = async (req, res) => {
  try {
    const response = await inventoryModel.findByIdAndDelete(req.params._id);
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
const getSearchedInventoryController = async (req, res) => {
  try {
    const requestedProduct = req.params.searchQuery;
    const inventory = await inventoryModel
      .find({ productName: { $regex: new RegExp(requestedProduct, "i") } })
      .sort({ date: -1 }) // sort the dates is descending order (-1)
      .lean();

    // Convert the date strings to ISO format for sorting
    inventory.forEach((item) => {
      item.dateISO = new Date(
        item.date.split("/").reverse().join("-")
      ).toISOString();
    });

    // Sort the inventory based on the ISO-formatted dates
    const sortedInventory = inventory.sort((a, b) => {
      return new Date(b.dateISO) - new Date(a.dateISO);
    });

    // Remove the temporary dateISO property if you don't need it in the result
    sortedInventory.forEach((item) => {
      delete item.dateISO;
    });

    //to calcu available Quantity
    const totalInOfRequestedQuantity = await inventoryModel.aggregate([
      {
        $match: {
          productName: { $regex: new RegExp(requestedProduct, "i") },
          inventoryType: "IN",
        },
      },
      {
        $group: {
          _id: "$productName",
          total: { $sum: "$quantity" },
        },
      },
    ]);
    //console.log("Total In", totalInOfRequestedQuantity);
    const totalIn = totalInOfRequestedQuantity[0]?.total;

    //calculate out quantity
    const totalOutOfRequestedQuantity = await inventoryModel.aggregate([
      {
        $match: {
          productName: { $regex: new RegExp(requestedProduct, "i") },
          inventoryType: "OUT",
        },
      },
      {
        $group: {
          _id: "$productName",

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
      inventory,
      availableQuantity,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in getting searched inventory",
      error,
    });
  }
};

// statistics inventory
const getStatisticsInventoryController = async (req, res) => {
  try {
    // Retrieve inventory records from the database
    const inventoryRecords = await inventoryModel.find();

    // Process the data to get statistics
    const statistics = {};

    inventoryRecords.forEach((record) => {
      const { productName, inventoryType, quantity } = record;

      if (!statistics[productName]) {
        statistics[productName] = {
          inventoryType: inventoryType,
          produced: 0,
          sold: 0,
        };
      }

      if (record.inventoryType === "IN") {
        // Assuming 'IN' is for produced
        statistics[productName].produced += quantity;
      } else if (record.inventoryType === "OUT") {
        // Assuming 'OUT' is for sold
        statistics[productName].sold += quantity;
      }
    });

    // Transform data to the desired format
    const formattedData = Object.keys(statistics).map((productName) => ({
      productName: productName || "",
      inventoryType: statistics[productName].inventoryType || "",
      produced: statistics[productName].produced || 0,
      sold: statistics[productName].sold || 0,
    }));

    return res.status(200).send({
      success: true,
      message: "Statistics retrieved successfully",
      statistics: formattedData,
    });
  } catch (error) {
    console.error("Error occurred while fetching statistics", error);
    return res.status(500).send({
      success: false,
      error: "Internal Server Error",
    });
  }
};

module.exports = {
  createInventoryController,
  getInventoryController,
  deleteInventoryController,
  getSearchedInventoryController,
  getStatisticsInventoryController,
  getPredProductController,
};
