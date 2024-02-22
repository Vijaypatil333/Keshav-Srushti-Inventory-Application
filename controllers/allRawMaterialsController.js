const allRawMaterialsModel = require("../models/allRawMaterialsModel");
const userModel = require("../models/userModel");

// create inventory
const createAllRawMaterialsController = async (req, res) => {
  try {
    const { email } = req.body;
    //validation
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new error("User not Found");
    }

    //save record
    const AllRawMaterials = new allRawMaterialsModel(req.body);
    await AllRawMaterials.save();
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
const getAllRawMaterialsController = async (req, res) => {
  try {
    const AllRawMaterials = await allRawMaterialsModel
      .find() //query to find all records
      .sort({ rawMaterial: 1 }); // sort the dates is descending order (-1)

    return res.status(200).send({
      success: true,
      message: "Got all records",
      AllRawMaterials,
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
const deleteAllRawMaterialsController = async (req, res) => {
  try {
    const response = await allRawMaterialsModel.findByIdAndDelete(
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

//get searched records
const getSearchedAllRawMaterialsController = async (req, res) => {
  try {
    const allRawMaterialsName = req.params.searchQuery;
    const AllRawMaterials = await allRawMaterialsModel
      .find({ rawMaterial: { $regex: new RegExp(allRawMaterialsName, "i") } })
      .sort({ rawMaterial: 1 }); // sort the dates is descending order (-1)

    return res.status(200).send({
      success: true,
      message: "Got searched records",
      AllRawMaterials,
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
const getBufferedRawMaterialsController = async (req, res) => {
  try {
    const bufferedRawMaterialsName = req.query.rawMaterial;

    // Assuming you want to find the product based on the parameters
    const bufferedRawMaterials = await allRawMaterialsModel.findOne({
      rawMaterial: bufferedRawMaterialsName,
    });

    if (!bufferedRawMaterials) {
      return res.status(500).send({
        success: false,
        message: `${bufferedRawMaterialsName} is not available in All Raw Materials`,
      });
    }
    buffer = bufferedRawMaterials.bufferSize;
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
  createAllRawMaterialsController,
  getAllRawMaterialsController,
  deleteAllRawMaterialsController,
  getSearchedAllRawMaterialsController,
  getBufferedRawMaterialsController,
};
