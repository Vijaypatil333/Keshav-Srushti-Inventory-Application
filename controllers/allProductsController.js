const allProductsModel = require("../models/allProductsModel");
const userModel = require("../models/userModel");

// create inventory
const createAllProductController = async (req, res) => {
  try {
    const { email } = req.body;
    //validation
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new error("User not Found");
    }

    //save record
    const AllProducts = new allProductsModel(req.body);
    await AllProducts.save();
    return res.status(201).send({
      success: true,
      message: "New record saved successfully",
    });
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
const getAllProductsController = async (req, res) => {
  try {
    const AllProducts = await allProductsModel
      .find() //query to find all records
      .sort({ productName: 1 }); // sort the dates is descending order (-1)

    return res.status(200).send({
      success: true,
      message: "Got all records",
      AllProducts,
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
const deleteAllProductsController = async (req, res) => {
  try {
    const response = await allProductsModel.findByIdAndDelete(req.params._id);
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
const getSearchedAllProductsController = async (req, res) => {
  try {
    const allProductName = req.params.searchQuery;
    const AllProducts = await allProductsModel
      .find({ productName: { $regex: new RegExp(allProductName, "i") } })
      .sort({ productName: 1 }); // sort the dates is descending order (-1)

    return res.status(200).send({
      success: true,
      message: "Got searched records",
      AllProducts,
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

//get buffered records
const getBufferedProductsController = async (req, res) => {
  try {
    const bufferedProductName = req.query.productName;
    const bufferedProductPacking = req.query.packing;

    // Assuming you want to find the product based on the parameters
    const bufferedProduct = await allProductsModel.findOne({
      productName: bufferedProductName,
      packing: bufferedProductPacking,
    });

    if (!bufferedProduct) {
      return res.status(500).send({
        success: false,
        message: `${bufferedProductName} with ${bufferedProductPacking} packing is not available in All Products`,
      });
    }
    buffer = bufferedProduct.bufferSize;
    return res.status(200).send({
      buffer,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in getting buffered record",
      error,
    });
  }
};

module.exports = {
  createAllProductController,
  getAllProductsController,
  deleteAllProductsController,
  getSearchedAllProductsController,
  getBufferedProductsController,
};
