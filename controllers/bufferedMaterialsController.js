const bufferedMaterialsModel = require("../models/bufferedMaterialsModel");
const userModel = require("../models/userModel");

// create buffer product
const createBufferedMaterialsController = async (req, res) => {
  try {
    const { email } = req.body;
    //validation
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new error("User not Found");
    }

    //save record
    const buffered = new bufferedMaterialsModel(req.body);
    await buffered.save();
    return res.status(201).send({
      success: true,
      message: "New Buffered Material saved successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Failed to add New Buffered Material",
      error,
    });
  }
};

//get all records
const getBufferedMaterialsController = async (req, res) => {
  try {
    const buffered = await bufferedMaterialsModel
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
const deleteBufferedMaterialsController = async (req, res) => {
  try {
    const response = await bufferedMaterialsModel.findByIdAndDelete(
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
const deleteBufferedMaterialsByNameController = async (req, res) => {
  try {
    const requestedMaterial = req.query.productName;

    const response = await bufferedMaterialsModel.deleteOne({
      materialName: requestedMaterial,
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
const getSearchedBufferedMaterialsController = async (req, res) => {
  try {
    const requestedMaterial = req.params.searchQuery;
    const buffered = await bufferedMaterialsModel
      .find({ materialName: { $regex: new RegExp(requestedMaterial, "i") } })
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
  createBufferedMaterialsController,
  getBufferedMaterialsController,
  deleteBufferedMaterialsController,
  getSearchedBufferedMaterialsController,
  deleteBufferedMaterialsByNameController,
};
