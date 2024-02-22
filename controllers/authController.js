const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerController = async (req, res) => {
  try {
    const existingUser = await userModel.findOne({ email: req.body.email });
    //validation
    if (existingUser) {
      return res.status(400).send({
        success: false,
        message: "User Already Exists!!",
      });
    }
    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashPassword;

    //hash secretKey
    const hashsecretkey = await bcrypt.hash(req.body.secretKey, salt);
    req.body.secretKey = hashsecretkey;

    //rest data
    const user = new userModel(req.body);
    await user.save();
    return res.status(200).send({
      success: true,
      message: "User Registered Successfully!!",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Register API",
      error,
    });
  }
};

// login call back
const loginController = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).send({
        success: false,
        message: `Invalid Credentials`,
      });
    }
    //compare password
    const comparePassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!comparePassword) {
      return res.status(500).send({
        success: false,
        message: `Invalid Credentials`,
      });
    }
    //session timeout
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    return res.status(200).send({
      success: true,
      message: `Login Successfully`,
      token,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Error in Login API`,
      error,
    });
  }
};

//get current user
const currentControllerUser = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    return res.status(200).send({
      success: true,
      message: `User Fetched successfully`,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: `Unable to get current user`,
      error,
    });
  }
};

const resetPasswordController = async (req, res) => {
  try {
    const existingUser = await userModel.findOne({ email: req.body.email });
    //validation
    if (! existingUser) {
      return res.status(400).send({
        success: false,
        message: "User Not Exists!!",
      });
    }
    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    //hash secretKey
    //const hashsecretkey = await bcrypt.hash(req.body.secretKey, salt);
    //req.body.secretKey = hashsecretkey;

    //rest data
    //const user = new userModel(req.body);
    //await user.save();

    const updatedUser = await userModel.findOneAndUpdate(
      { email: req.body.email },
      { password: hashPassword },
      { new: true } // return the updated document
    );
    return res.status(200).send({
      success: true,
      message: "Password changed Successfully!!",
      user: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In reset API",
      error,
    });
  }
};

module.exports = { registerController, loginController, currentControllerUser, resetPasswordController };
