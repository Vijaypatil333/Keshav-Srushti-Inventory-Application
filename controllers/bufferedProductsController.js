const bufferedProductsModel = require("../models/bufferedProductsModel");
const userModel = require("../models/userModel");

// create buffer product
const createBufferedProductsController = async (req, res) => {
  try {
    const { email } = req.body;
    //validation
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new error("User not Found");
    }

    //save record
    const buffered = new bufferedProductsModel(req.body);
    await buffered.save();
    return res.status(201).send({
      success: true,
      message: "New Buffered Product saved successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Failed to add New Buffered Product",
      error,
    });
  }
};

//get all records
const getBufferedProductsController = async (req, res) => {
  try {
    const buffered = await bufferedProductsModel
      .find()
      .sort({ date: -1 }) // sort the dates is descending order (-1)
      .lean();

    return res.status(200).send({
      success: true,
      message: "Got all records",
      buffered,
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

//delete buffer product
const deleteBufferedProductsController = async (req, res) => {
  try {
    const response = await bufferedProductsModel.findByIdAndDelete(
      req.params._id
    );
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

//delete buffer product
const deleteBufferedProductsByNameController = async (req, res) => {
  try {
    const requestedProduct = req.query.productName;
    const requestedPacking = req.query.packing;

    const response = await bufferedProductsModel.deleteOne({
      productName: requestedProduct,
      packing: requestedPacking,
    });
    if (response.deletedCount > 0) {
      return res.status(200).send({
        success: true,
        message: "Buffered Record deleted successfully",
      });
    } else {
      return res.status(500).send({
        success: false,
        message: "No matching record found for deletion ",
      });
    }
  } catch (error) {
    console.error("Error occurred while deleting the record", error);
    return res.status(500).send({
      success: false,
      message: "Error in Record deleting",
      error: error.message,
    });
  }
};

//get searched records
const getSearchedBufferedProductsController = async (req, res) => {
  try {
    const requestedProduct = req.params.searchQuery;
    const buffered = await bufferedProductsModel
      .find({ productName: { $regex: new RegExp(requestedProduct, "i") } })
      .sort({ date: -1 }) // sort the dates is descending order (-1)
      .lean();

    return res.status(200).send({
      success: true,
      message: "Got searched records",
      buffered,
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

module.exports = {
  createBufferedProductsController,
  getBufferedProductsController,
  deleteBufferedProductsController,
  getSearchedBufferedProductsController,
  deleteBufferedProductsByNameController,
};
